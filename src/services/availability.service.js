import Service from '../models/Service.js';
import BarberShop from '../models/BarberShop.js';
import Appointment from '../models/Appointment.js';
import BlockedTime from '../models/BlockedTime.js';
import { ApiError } from '../utils/apiError.js';
import { 
  parseDateInTimeZone, 
  formatDateInTimeZone, 
  getDayOfWeekInTimeZone,
  timeToDateInTimeZone,
  addMinutesToDate,
  isTodayInTimeZone,
  getStartOfDayInTimeZone,
  getEndOfDayInTimeZone,
  getNextDays,
  doRangesOverlap,
  addDaysToDate
} from '../utils/dateTime.js';
import { 
  getOpenPeriodsForDay,
  isShopOpenOnDay,
  timeToMinutes,
  minutesToTime
} from './openingHours.service.js';

class AvailabilityService {
  constructor() {
    this.slotInterval = 30;
    this.maxDaysAhead = 90;
  }

  async getAvailableSlots(shopId, serviceId, date, options = {}) {
    const {
      startTime = null,
      endTime = null,
      includeUnavailable = false
    } = options;

    const shop = await BarberShop.findById(shopId);
    if (!shop) {
      throw ApiError.notFound('Shop not found', 'SHOP_NOT_FOUND');
    }

    if (shop.status !== 'approved') {
      throw ApiError.badRequest('Shop is not approved', 'SHOP_NOT_APPROVED');
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      throw ApiError.notFound('Service not found', 'SERVICE_NOT_FOUND');
    }

    if (service.shopId.toString() !== shopId) {
      throw ApiError.badRequest('Service does not belong to this shop', 'SERVICE_SHOP_MISMATCH');
    }

    if (!service.active) {
      throw ApiError.badRequest('Service is not active', 'SERVICE_INACTIVE');
    }

    const targetDate = parseDateInTimeZone(date, shop.timezone);
    const today = new Date();
    
    // Check if date is in the past
    const todayStr = formatDateInTimeZone(today, shop.timezone, 'yyyy-MM-dd');
    if (date < todayStr) {
      throw ApiError.validation('Cannot check availability for past date', 'PAST_DATE');
    }

    // Check if date is too far in future
    const maxDate = addDaysToDate(today, this.maxDaysAhead);
    if (targetDate > maxDate) {
      throw ApiError.validation(`Cannot check availability more than ${this.maxDaysAhead} days ahead`, 'DATE_TOO_FAR');
    }

    const dayOfWeek = getDayOfWeekInTimeZone(targetDate, shop.timezone);

    if (!isShopOpenOnDay(shop.openingHours, dayOfWeek)) {
      return {
        date,
        dayOfWeek,
        isOpen: false,
        slots: [],
        message: 'Shop is closed on this day'
      };
    }

    const openPeriods = getOpenPeriodsForDay(shop.openingHours, dayOfWeek);

    const dayStart = getStartOfDayInTimeZone(date, shop.timezone);
    const dayEnd = getEndOfDayInTimeZone(date, shop.timezone);
    
    const existingAppointments = await Appointment.find({
      shopId,
      startDateTime: { $lt: dayEnd },
      endDateTime: { $gt: dayStart },
      status: { $in: ['pending', 'confirmed'] }
    }).select('startDateTime endDateTime status');

    const blockedTimes = await BlockedTime.find({
      shopId,
      startDateTime: { $lt: dayEnd },
      endDateTime: { $gt: dayStart }
    }).select('startDateTime endDateTime reason');

    const slots = [];
    const serviceDuration = service.durationMinutes;

    for (const period of openPeriods) {
      let periodStart = timeToDateInTimeZone(date, period.start, shop.timezone);
      const periodEnd = timeToDateInTimeZone(date, period.end, shop.timezone);

      if (startTime) {
        const customStart = timeToDateInTimeZone(date, startTime, shop.timezone);
        if (customStart > periodStart) {
          periodStart = customStart;
        }
      }

      let actualPeriodEnd = periodEnd;
      if (endTime) {
        const customEnd = timeToDateInTimeZone(date, endTime, shop.timezone);
        if (customEnd < periodEnd) {
          actualPeriodEnd = customEnd;
        }
      }

      let currentSlotStart = periodStart;
      while (currentSlotStart < actualPeriodEnd) {
        const currentSlotEnd = addMinutesToDate(currentSlotStart, serviceDuration);

        if (currentSlotEnd <= actualPeriodEnd) {
          const slotInfo = this.checkSlotAvailability(
            currentSlotStart,
            currentSlotEnd,
            existingAppointments,
            blockedTimes,
            today
          );

          if (slotInfo.available || includeUnavailable) {
            slots.push({
              startTime: formatDateInTimeZone(currentSlotStart, shop.timezone, 'HH:mm'),
              endTime: formatDateInTimeZone(currentSlotEnd, shop.timezone, 'HH:mm'),
              startDateTime: currentSlotStart,
              endDateTime: currentSlotEnd,
              available: slotInfo.available,
              reason: slotInfo.reason
            });
          }
        }

        currentSlotStart = addMinutesToDate(currentSlotStart, this.slotInterval);
      }
    }

    slots.sort((a, b) => a.startDateTime - b.startDateTime);

    return {
      date,
      dayOfWeek,
      isOpen: true,
      timezone: shop.timezone,
      serviceDuration,
      slotInterval: this.slotInterval,
      totalSlots: slots.length,
      availableSlots: slots.filter(s => s.available).length,
      slots
    };
  }

  checkSlotAvailability(slotStart, slotEnd, appointments, blockedTimes, currentTime) {
    if (slotStart < currentTime) {
      return { available: false, reason: 'past_time' };
    }

    const hasAppointmentConflict = appointments.some(appointment => {
      return doRangesOverlap(
        slotStart,
        slotEnd,
        appointment.startDateTime,
        appointment.endDateTime
      );
    });

    if (hasAppointmentConflict) {
      return { available: false, reason: 'appointment_conflict' };
    }

    const hasBlockedTimeConflict = blockedTimes.some(blocked => {
      return doRangesOverlap(
        slotStart,
        slotEnd,
        blocked.startDateTime,
        blocked.endDateTime
      );
    });

    if (hasBlockedTimeConflict) {
      return { available: false, reason: 'blocked_time' };
    }

    return { available: true, reason: null };
  }

  // FIXED: getAvailableDates with past date filtering
  async getAvailableDates(shopId, serviceId, days = 14) {
    const shop = await BarberShop.findById(shopId);
    if (!shop) {
      throw ApiError.notFound('Shop not found', 'SHOP_NOT_FOUND');
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      throw ApiError.notFound('Service not found', 'SERVICE_NOT_FOUND');
    }

    const availableDates = [];
    const nextDays = getNextDays(days, shop.timezone);
    const todayStr = formatDateInTimeZone(new Date(), shop.timezone, 'yyyy-MM-dd');

    for (const dayInfo of nextDays) {
      const dayOfWeek = dayInfo.dayOfWeek;
      const dateString = dayInfo.date;
      
      // Skip past dates
      if (dateString < todayStr) {
        continue;
      }
      
      // Skip closed days
      if (!isShopOpenOnDay(shop.openingHours, dayOfWeek)) {
        continue;
      }

      try {
        // Check if there are any available slots for this day
        const availability = await this.getAvailableSlots(shopId, serviceId, dateString);
        
        if (availability.availableSlots > 0) {
          availableDates.push({
            date: dateString,
            dayOfWeek,
            availableSlots: availability.availableSlots,
            isToday: dateString === todayStr
          });
        }
      } catch (err) {
        // Skip dates that cause errors (like past dates)
        console.log(`Skipping date ${dateString}: ${err.message}`);
        continue;
      }
    }

    return availableDates;
  }

  async checkSpecificSlot(shopId, serviceId, date, time) {
    const availability = await this.getAvailableSlots(shopId, serviceId, date, {
      startTime: time,
      endTime: time
    });

    const slot = availability.slots.find(s => s.startTime === time);
    
    return {
      available: slot ? slot.available : false,
      reason: slot ? slot.reason : 'outside_opening_hours',
      date,
      time,
      timezone: availability.timezone
    };
  }

  async getNextAvailableSlots(shopId, serviceId, count = 5) {
    const shop = await BarberShop.findById(shopId);
    if (!shop) {
      throw ApiError.notFound('Shop not found', 'SHOP_NOT_FOUND');
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      throw ApiError.notFound('Service not found', 'SERVICE_NOT_FOUND');
    }

    const nextSlots = [];
    const today = new Date();
    const todayStr = formatDateInTimeZone(today, shop.timezone, 'yyyy-MM-dd');
    
    for (let i = 0; i < 14 && nextSlots.length < count; i++) {
      const checkDate = addDaysToDate(today, i);
      const dateString = formatDateInTimeZone(checkDate, shop.timezone, 'yyyy-MM-dd');
      
      if (dateString < todayStr) {
        continue;
      }
      
      try {
        const availability = await this.getAvailableSlots(shopId, serviceId, dateString);
        
        for (const slot of availability.slots) {
          if (slot.available && nextSlots.length < count) {
            nextSlots.push({
              date: dateString,
              startTime: slot.startTime,
              endTime: slot.endTime,
              startDateTime: slot.startDateTime,
              endDateTime: slot.endDateTime
            });
          }
        }
      } catch (err) {
        console.log(`Skipping date ${dateString}: ${err.message}`);
        continue;
      }
    }

    return nextSlots;
  }

  async getAvailabilitySummary(shopId, serviceId, startDate, endDate) {
    const shop = await BarberShop.findById(shopId);
    if (!shop) {
      throw ApiError.notFound('Shop not found', 'SHOP_NOT_FOUND');
    }

    const summary = [];
    let currentDate = parseDateInTimeZone(startDate, shop.timezone);
    const lastDate = parseDateInTimeZone(endDate, shop.timezone);
    const todayStr = formatDateInTimeZone(new Date(), shop.timezone, 'yyyy-MM-dd');

    while (currentDate <= lastDate) {
      const dateString = formatDateInTimeZone(currentDate, shop.timezone, 'yyyy-MM-dd');
      const dayOfWeek = getDayOfWeekInTimeZone(currentDate, shop.timezone);
      
      if (dateString < todayStr) {
        currentDate = addDaysToDate(currentDate, 1);
        continue;
      }
      
      if (isShopOpenOnDay(shop.openingHours, dayOfWeek)) {
        try {
          const availability = await this.getAvailableSlots(shopId, serviceId, dateString);
          summary.push({
            date: dateString,
            dayOfWeek,
            totalSlots: availability.totalSlots,
            availableSlots: availability.availableSlots,
            isFullyBooked: availability.totalSlots > 0 && availability.availableSlots === 0,
            isOpen: true
          });
        } catch (err) {
          summary.push({
            date: dateString,
            dayOfWeek,
            totalSlots: 0,
            availableSlots: 0,
            isFullyBooked: false,
            isOpen: true
          });
        }
      } else {
        summary.push({
          date: dateString,
          dayOfWeek,
          totalSlots: 0,
          availableSlots: 0,
          isFullyBooked: false,
          isOpen: false
        });
      }

      currentDate = addDaysToDate(currentDate, 1);
    }

    return summary;
  }
}

export default new AvailabilityService();
import { VerifiableTicket } from '@/types';

const TICKETS_KEY = 'riviera_tickets_v1';
const LOYALTY_KEY = 'riviera_loyalty_points_v1';

export const storageService = {
  getTickets(): VerifiableTicket[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(TICKETS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse tickets', e);
    }
    return [];
  },

  saveTicket(ticket: VerifiableTicket): void {
    if (typeof window === 'undefined') return;
    try {
      const tickets = this.getTickets();
      tickets.unshift(ticket);
      localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.error('Failed to save ticket', e);
    }
  },

  validateTicket(ticketId: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const tickets = this.getTickets();
      const target = tickets.find(t => t.ticketId === ticketId);
      if (target) {
        target.isValidated = true;
        target.validatedAt = Date.now();
        localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
        return true;
      }
    } catch (e) {
      console.error('Failed to validate ticket', e);
    }
    return false;
  },

  getLoyaltyPoints(): number {
    if (typeof window === 'undefined') return 0;
    try {
      const val = localStorage.getItem(LOYALTY_KEY);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  addLoyaltyPoints(pts: number): number {
    if (typeof window === 'undefined') return 0;
    const current = this.getLoyaltyPoints();
    const updated = current + pts;
    localStorage.setItem(LOYALTY_KEY, updated.toString());
    return updated;
  },
};

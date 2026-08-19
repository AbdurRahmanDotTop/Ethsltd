"use client";

import { useState } from "react";
import { P2PExpertService, P2PExpertProfile } from "@/lib/p2p/types";
import { X, Calendar, Clock, Video, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@ethsltd/api-client";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useRouter } from "next/navigation";

interface BookingModalProps {
  expert: any;
  service: any;
  onClose: () => void;
}

export function BookingModal({ expert, service, onClose }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 = Insufficient Balance
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [balanceData, setBalanceData] = useState<{ required: number, available: number, currency: string } | null>(null);

  const requireAuth = useRequireAuth();
  const router = useRouter();

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const generateTimes = () => {
    return ["09:00", "10:30", "14:00", "15:30", "17:00"];
  };

  const handleConfirm = () => {
    requireAuth(async () => {
      setIsProcessing(true);
      try {
        const scheduledAt = `${selectedDate}T${selectedTime}:00.000Z`;
        const res: any = await apiClient.bookExpertService({
          serviceId: service.id,
          scheduledAt
        });

        if (res.success) {
          setStep(3); // Success
        } else if (res.error === 'INSUFFICIENT_BALANCE') {
          setBalanceData({ required: res.required, available: res.available, currency: res.currency });
          setStep(4); // Insufficient Balance State
        } else {
          console.error("Booking error:", res.error);
        }
      } catch (error) {
        console.error("Booking failed:", error);
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const handleDeposit = () => {
    router.push('/wallet/deposit');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-4 border-b border-border flex-wrap gap-y-4">
          <h2 className="font-semibold text-lg">Book Expert Service</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-1">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{expert.displayName}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-foreground font-medium">
                    {formatCurrency(service.price, service.currency)}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.durationMinutes || service.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Video className="w-4 h-4" />
                    <span>Video Call</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Select Date</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {generateDates().map(date => {
                    const d = new Date(date);
                    const isSelected = selectedDate === date;
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-2 rounded-lg border text-sm flex flex-col items-center justify-center transition-colors ${
                          isSelected 
                            ? "border-brand-600 bg-brand-600/10 text-brand-600 font-medium" 
                            : "border-border hover:border-brand-500/50 text-muted-foreground"
                        }`}
                      >
                        <span className="text-xs">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span>{d.getDate()} {d.toLocaleDateString('en-US', { month: 'short' })}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Select Time</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {generateTimes().map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 rounded-lg border text-sm text-center transition-colors ${
                          selectedTime === time
                            ? "border-brand-600 bg-brand-600/10 text-brand-600 font-medium"
                            : "border-border hover:border-brand-500/50 text-muted-foreground"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-medium text-foreground text-lg mb-4">Confirm Booking</h3>
              
              <div className="bg-muted/50 p-4 rounded-xl border border-border space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expert</span>
                  <span className="font-medium text-foreground">{expert.displayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-foreground text-right max-w-[200px] truncate">{service.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schedule</span>
                  <span className="font-medium text-foreground">{selectedDate} at {selectedTime}</span>
                </div>
              </div>

              <div className="bg-brand-500/10 p-4 rounded-xl border border-brand-500/20 text-sm">
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-foreground">Total Amount</span>
                  <span className="text-brand-600 text-lg">{formatCurrency(service.price, service.currency)}</span>
                </div>
                <p className="text-muted-foreground text-xs mt-2">
                  This amount will be locked in escrow from your funding wallet until the service is completed.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Booking Confirmed!</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Your consultation with {expert.displayName} is scheduled for {selectedDate} at {selectedTime}.
              </p>
            </div>
          )}

          {step === 4 && balanceData && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-2">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Insufficient Wallet Balance</h3>
              
              <div className="w-full bg-muted p-4 rounded-lg border border-border text-sm text-left mt-4 mb-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Required Amount:</span>
                  <span className="font-medium text-foreground">{formatCurrency(balanceData.required, balanceData.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Balance:</span>
                  <span className="font-medium text-red-500">{formatCurrency(balanceData.available, balanceData.currency)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border mt-2">
                  <span className="text-muted-foreground">Shortfall:</span>
                  <span className="font-bold text-foreground">{formatCurrency(balanceData.required - balanceData.available, balanceData.currency)}</span>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm">
                You need to add funds to your wallet to complete this booking.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/20">
          {step === 1 && (
            <>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => setStep(2)} disabled={!selectedDate || !selectedTime}>Continue</Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => setStep(1)} disabled={isProcessing}>Back</Button>
              <Button onClick={handleConfirm} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Confirm & Pay
              </Button>
            </>
          )}
          {step === 3 && (
            <Button onClick={onClose} className="w-full">Done</Button>
          )}
          {step === 4 && (
            <>
              <Button variant="outline" onClick={() => setStep(2)}>Cancel</Button>
              <Button onClick={handleDeposit}>Deposit Funds</Button>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}

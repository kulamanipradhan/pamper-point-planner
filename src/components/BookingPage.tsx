
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { mockServices, mockStylists, generateTimeSlots } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Clock, User, CalendarDays } from 'lucide-react';

interface BookingPageProps {
  selectedServiceId: string | null;
  onPageChange: (page: string) => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ selectedServiceId, onPageChange }) => {
  const [selectedService, setSelectedService] = useState(
    selectedServiceId ? mockServices.find(s => s.id === selectedServiceId) : null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedStylist, setSelectedStylist] = useState<string>('');
  const [step, setStep] = useState(selectedService ? 2 : 1);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const timeSlots = selectedDate ? generateTimeSlots(selectedDate.toISOString().split('T')[0]) : [];

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: 'Incomplete booking',
        description: 'Please select a service, date, and time.',
        variant: 'destructive',
      });
      return;
    }

    // Mock booking creation
    console.log('Creating booking:', {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      stylist: selectedStylist,
      user: user?.id,
    });

    toast({
      title: 'Booking confirmed!',
      description: `Your ${selectedService.name} appointment has been booked for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`,
    });

    onPageChange('my-bookings');
  };

  const canProceed = selectedService && selectedDate && selectedTime;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">Follow the steps below to schedule your service</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Select Service</span>
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Choose Date & Time</span>
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Confirm</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockServices.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedService?.id === service.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{service.name}</h3>
                          <Badge variant="secondary">{service.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration} mins
                          </div>
                          <div className="font-bold text-purple-600">${service.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Date and Time Selection */}
            {step >= 2 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CalendarDays className="h-5 w-5 mr-2" />
                      Select Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>

                {selectedDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedTime === slot.time ? "default" : "outline"}
                            className="h-10"
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Choose Stylist (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div
                        onClick={() => setSelectedStylist('')}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedStylist === '' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                        }`}
                      >
                        <p className="font-medium">No preference</p>
                        <p className="text-sm text-gray-600">Let us assign the best available stylist</p>
                      </div>
                      {mockStylists.map((stylist) => (
                        <div
                          key={stylist.id}
                          onClick={() => setSelectedStylist(stylist.id)}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedStylist === stylist.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <img 
                              src={stylist.image_url} 
                              alt={stylist.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium">{stylist.name}</p>
                              <p className="text-sm text-gray-600">{stylist.specialties.join(', ')}</p>
                              <div className="flex items-center mt-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm ml-1">{stylist.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedService && (
                  <div>
                    <h4 className="font-medium">Service</h4>
                    <p className="text-sm text-gray-600">{selectedService.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-500">{selectedService.duration} minutes</span>
                      <span className="font-bold">${selectedService.price}</span>
                    </div>
                  </div>
                )}

                {selectedDate && (
                  <div>
                    <h4 className="font-medium">Date</h4>
                    <p className="text-sm text-gray-600">{selectedDate.toLocaleDateString()}</p>
                  </div>
                )}

                {selectedTime && (
                  <div>
                    <h4 className="font-medium">Time</h4>
                    <p className="text-sm text-gray-600">{selectedTime}</p>
                  </div>
                )}

                {selectedStylist && (
                  <div>
                    <h4 className="font-medium">Stylist</h4>
                    <p className="text-sm text-gray-600">
                      {mockStylists.find(s => s.id === selectedStylist)?.name || 'No preference'}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-purple-600">${selectedService?.price || 0}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleBooking}
                  disabled={!canProceed}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

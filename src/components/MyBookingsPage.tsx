
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockBookings, mockServices, mockStylists } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, MapPin } from 'lucide-react';

interface MyBookingsPageProps {
  onPageChange: (page: string) => void;
}

const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings] = useState(mockBookings);

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed');

  const getService = (serviceId: string) => mockServices.find(s => s.id === serviceId);
  const getStylist = (stylistId?: string) => stylistId ? mockStylists.find(s => s.id === stylistId) : null;

  const handleCancelBooking = (bookingId: string) => {
    toast({
      title: 'Booking cancelled',
      description: 'Your appointment has been cancelled successfully.',
    });
  };

  const handleRescheduleBooking = (bookingId: string) => {
    onPageChange('booking');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const BookingCard = ({ booking, showActions = true }: { booking: any, showActions?: boolean }) => {
    const service = getService(booking.service_id);
    const stylist = getStylist(booking.stylist_id);

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{service?.name}</h3>
              <p className="text-gray-600">{service?.description}</p>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(booking.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{booking.time} ({service?.duration} minutes)</span>
            </div>
            {stylist && (
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>{stylist.name}</span>
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Luxe Salon</span>
            </div>
          </div>

          {booking.notes && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Notes:</strong> {booking.notes}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-lg font-bold text-purple-600">
              ${service?.price}
            </div>
            {showActions && booking.status !== 'completed' && booking.status !== 'cancelled' && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRescheduleBooking(booking.id)}
                >
                  Reschedule
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your upcoming and past appointments</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="history">History ({pastBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                  <p className="text-gray-600 text-center mb-4">
                    You don't have any upcoming appointments scheduled.
                  </p>
                  <Button onClick={() => onPageChange('booking')}>
                    Book an Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No booking history</h3>
                  <p className="text-gray-600 text-center">
                    Your completed appointments will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} showActions={false} />
              ))
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button onClick={() => onPageChange('services')} size="lg">
            Browse Services
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockBookings, mockServices, mockStylists } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AdminDashboardProps {
  onPageChange: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onPageChange }) => {
  const [bookings] = useState(mockBookings);
  const [services, setServices] = useState(mockServices);
  const [stylists] = useState(mockStylists);
  const [editingService, setEditingService] = useState<any>(null);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const { toast } = useToast();

  const todayBookings = bookings.filter(b => b.date === new Date().toISOString().split('T')[0]);
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (services.find(s => s.id === b.service_id)?.price || 0), 0);

  const handleApproveBooking = (bookingId: string) => {
    toast({
      title: 'Booking approved',
      description: 'The appointment has been confirmed.',
    });
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const serviceData = {
      id: editingService?.id || Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      duration: parseInt(formData.get('duration') as string),
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      image_url: formData.get('image_url') as string || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
      created_at: editingService?.created_at || new Date().toISOString(),
    };

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? serviceData : s));
      toast({ title: 'Service updated successfully' });
    } else {
      setServices([...services, serviceData]);
      toast({ title: 'Service created successfully' });
    }

    setEditingService(null);
    setIsServiceDialogOpen(false);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
    toast({ title: 'Service deleted successfully' });
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your salon operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{todayBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Stylists</p>
                  <p className="text-2xl font-bold text-gray-900">{stylists.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="stylists">Stylists</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 10).map((booking) => {
                    const service = services.find(s => s.id === booking.service_id);
                    const stylist = stylists.find(s => s.id === booking.stylist_id);
                    
                    return (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium">{service?.name}</p>
                              <p className="text-sm text-gray-600">{booking.date} at {booking.time}</p>
                              {stylist && <p className="text-sm text-gray-600">with {stylist.name}</p>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <span className="font-medium">${service?.price}</span>
                          {booking.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveBooking(booking.id)}
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Services</h2>
              <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingService(null); setIsServiceDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleServiceSubmit}>
                    <DialogHeader>
                      <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                      <DialogDescription>
                        {editingService ? 'Update the service details below.' : 'Create a new service for your salon.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Service Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          defaultValue={editingService?.name}
                          required 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          name="description" 
                          defaultValue={editingService?.description}
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="duration">Duration (mins)</Label>
                          <Input 
                            id="duration" 
                            name="duration" 
                            type="number" 
                            defaultValue={editingService?.duration}
                            required 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="price">Price ($)</Label>
                          <Input 
                            id="price" 
                            name="price" 
                            type="number" 
                            step="0.01"
                            defaultValue={editingService?.price}
                            required 
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Input 
                          id="category" 
                          name="category" 
                          defaultValue={editingService?.category}
                          required 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input 
                          id="image_url" 
                          name="image_url" 
                          type="url" 
                          defaultValue={editingService?.image_url}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {editingService ? 'Update Service' : 'Create Service'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-4">
                    <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                      <img 
                        src={service.image_url} 
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">{service.duration} mins</span>
                      <span className="font-bold text-purple-600">${service.price}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingService(service);
                          setIsServiceDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stylists" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Salon Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stylists.map((stylist) => (
                    <div key={stylist.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img 
                        src={stylist.image_url} 
                        alt={stylist.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{stylist.name}</h3>
                        <p className="text-sm text-gray-600">{stylist.specialties.join(', ')}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm ml-1">{stylist.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

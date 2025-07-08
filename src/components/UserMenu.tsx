import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    boardOfEducation: '',
    class: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleEditProfile = () => {
    if (profile) {
      setEditFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        boardOfEducation: profile.board_of_education || '',
        class: profile.class || '',
        city: profile.city || '',
        state: profile.state || ''
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editFormData.firstName,
          last_name: editFormData.lastName,
          board_of_education: editFormData.boardOfEducation,
          class: editFormData.class,
          city: editFormData.city,
          state: editFormData.state
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully!",
        description: "Your changes have been saved."
      });

      setIsEditDialogOpen(false);
      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  const userInitials = profile?.first_name && profile?.last_name 
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : user.email?.[0]?.toUpperCase() || 'U';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
              <AvatarFallback className="bg-gradient-primary text-white">{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm border-white/20" align="end" forceMount>
          <DropdownMenuItem onClick={handleEditProfile} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Profile</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={editFormData.firstName}
                  onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={editFormData.lastName}
                  onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="board" className="text-white">Board of Education</Label>
              <Select value={editFormData.boardOfEducation} onValueChange={(value) => setEditFormData({ ...editFormData, boardOfEducation: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900">
                  <SelectItem value="Telangana State Board">Telangana State Board</SelectItem>
                  <SelectItem value="CBSE">CBSE</SelectItem>
                  <SelectItem value="ICSE">ICSE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class" className="text-white">Class</Label>
              <Select value={editFormData.class} onValueChange={(value) => setEditFormData({ ...editFormData, class: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 text-gray-900">
                  <SelectItem value="6th">6th</SelectItem>
                  <SelectItem value="7th">7th</SelectItem>
                  <SelectItem value="8th">8th</SelectItem>
                  <SelectItem value="9th">9th</SelectItem>
                  <SelectItem value="10th">10th</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-white">City</Label>
                <Input
                  id="city"
                  type="text"
                  value={editFormData.city}
                  onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-white">State</Label>
                <Input
                  id="state"
                  type="text"
                  value={editFormData.state}
                  onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                Save Changes
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NameInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNameSubmit: (name: string) => void;
}

const NameInputDialog = ({ open, onOpenChange, onNameSubmit }: NameInputDialogProps) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onNameSubmit(name.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter your name</DialogTitle>
          <p className="text-sm text-muted-foreground">
            This is how you will be presented.
          </p>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="sr-only">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!name.trim()}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NameInputDialog;

interface MobileMenuProps {
  open: boolean;
  onClose: (value: boolean) => void;
}

const MobileMenu = ({ open, onClose }: MobileMenuProps) => {
  // Placeholder - will be fully implemented in Task 2
  if (!open) return null;
  return (
    <div>
      <button onClick={() => onClose(false)}>Close</button>
    </div>
  );
};

export default MobileMenu;

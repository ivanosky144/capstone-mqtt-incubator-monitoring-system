interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

export default function LogoutModal({ isOpen, onClose, onLogout }: LogoutModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed bg-gray-500 bg-opacity-50 flex justify-center items-center md:right-0 md:top-20">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4 md:text-lg text-dark_purple">Kamu yakin ingin keluar?</h2>
                <div className="flex justify-between">
                    <button 
                        className="bg-gray-300 px-4 py-2 rounded" 
                        onClick={onClose}>Batal
                    </button>
                    <button 
                        className="bg-red-500 text-white px-4 py-2 rounded" 
                        onClick={() => {
                            onLogout(); 
                            onClose();
                        }}>
                        Keluar
                    </button>
                </div>
            </div>
        </div>
    );
}
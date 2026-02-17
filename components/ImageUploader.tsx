
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg, { Area } from '../utils/cropImage';

interface ImageUploaderProps {
    onClose: () => void;
    onCropComplete: (croppedImage: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onClose, onCropComplete }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onCropCompleteCallback = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Файл занадто великий. Максимальний розмір 5MB.');
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                setError('Непідтримуваний тип файлу. Будь ласка, оберіть JPG, PNG, або GIF.');
                return;
            }

            setError(null);
            let imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl as string);
        }
    };

    const handleApplyCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
            setError('Не вдалося обрізати зображення.');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 relative flex flex-col">
                <h2 className="text-2xl font-bold text-center mb-4 text-purple-600 dark:text-purple-300">Завантажити фото</h2>
                
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                {!imageSrc ? (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10">
                        <p className="mb-4 text-center text-gray-500 dark:text-gray-400">Оберіть файл до 5MB (JPG, PNG)</p>
                        <input
                            type="file"
                            id="file-upload"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                         <label htmlFor="file-upload" className="cursor-pointer bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                            Обрати файл
                        </label>
                    </div>
                ) : (
                    <>
                        <div className="relative w-full h-80 bg-gray-200 dark:bg-gray-900 rounded-lg overflow-hidden">
                           <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropCompleteCallback}
                                cropShape="round"
                                showGrid={false}
                           />
                        </div>
                        <div className="flex items-center space-x-4 my-4">
                            <span className="text-sm font-medium">Зум</span>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                        </div>
                    </>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        Скасувати
                    </button>
                     {imageSrc && (
                        <button onClick={handleApplyCrop} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors">
                           Застосувати
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

function readFile(file: File) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    });
}

export default ImageUploader;

import React, { useState } from 'react';

interface ProductGalleryProps {
  productName: string;
  mainImage: string;
  images?: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  productName,
  mainImage,
  images = [],
}) => {
  const allImages = images.length > 0 ? images : [mainImage];
  const [selectedImage, setSelectedImage] = useState<string>(allImages[0] ?? mainImage);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4 w-full h-fit">
      {/* Columna vertical de miniaturas estilo Mercado Libre */}
      <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[480px] shrink-0 p-1">
        {allImages.map((imgUrl, index) => {
          const isSelected = selectedImage === imgUrl;
          return (
            <button
              key={`${imgUrl}-${index}`}
              type="button"
              onClick={() => setSelectedImage(imgUrl)}
              onMouseEnter={() => setSelectedImage(imgUrl)}
              aria-label={`Ver imagen ${index + 1} de ${productName}`}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 p-1 bg-white dark:bg-zinc-800 transition-all cursor-pointer shrink-0 overflow-hidden ${
                isSelected
                  ? 'border-blue-600 dark:border-blue-400 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-500 opacity-75 hover:opacity-100'
              }`}
            >
              <img
                src={imgUrl}
                alt={`${productName} miniatura ${index + 1}`}
                className="w-full h-full object-cover rounded"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>

      {/* Visor de Imagen Principal */}
      <div className="relative flex-1 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-8 flex items-center justify-center min-h-[320px] sm:min-h-[440px] shadow-sm overflow-hidden group">
        <img
          src={selectedImage}
          alt={productName}
          className="max-h-[380px] w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 text-[11px] font-semibold text-slate-400 dark:text-zinc-500 bg-slate-100/80 dark:bg-zinc-800/80 px-2 py-1 rounded-md backdrop-blur-xs">
          Foto Real
        </div>
      </div>
    </div>
  );
};

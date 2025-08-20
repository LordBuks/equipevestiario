import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';

const CategoryMenu = ({ selectedCategory, onCategoryChange, categories, title }) => {
  const menuCategories = categories; // Agora usa apenas as categorias passadas
  const menuTitle = title || 'Categorias'; // Título padrão mais genérico

  const ButtonComponent = ({ category, isSelected }) => {
    const buttonWidth = 'w-auto px-4'; // Ajustar largura para ser mais flexível
    const buttonHeight = 'h-10';
    
    return (
      <button
        onClick={() => onCategoryChange(category)}
        className={`${buttonWidth} ${buttonHeight} rounded font-medium text-sm transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg whitespace-nowrap ${
          isSelected
            ? 'bg-white text-[#E5050F] border-2 border-[#E5050F] shadow-md'
            : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#E5050F] hover:border-[#E5050F]'
        }`}
      >
        {category}
      </button>
    );
  };

  return (
    <div className="bg-gradient-to-r from-[#E5050F] to-[#C20C18] py-4 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white text-center mb-4 tracking-wide">
          {menuTitle}
        </h2>
        
        {/* Layout para desktop (md e acima) */}
        <div className="hidden md:flex flex-wrap justify-center gap-3">
          {menuCategories.map((category) => (
            <ButtonComponent 
              key={category} 
              category={category} 
              isSelected={selectedCategory === category}
            />
          ))}
        </div>

        {/* Layout carrossel para mobile (abaixo de md) */}
        <div className="md:hidden">
          <Carousel
            opts={{
              align: "center",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {menuCategories.map((category) => (
                <CarouselItem key={category} className="pl-2 md:pl-4 basis-auto">
                  <ButtonComponent 
                    category={category} 
                    isSelected={selectedCategory === category}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;



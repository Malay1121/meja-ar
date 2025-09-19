    import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialCarouselProps {
  testimonials: {
    name: string;
    role: string;
    image: string;
    content: string;
  }[];
}

const TestimonialCarousel = ({ testimonials }: TestimonialCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl testimonial-slider">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          
          <blockquote className="text-xl sm:text-2xl text-neutral-900 mb-8 leading-relaxed">
            "{testimonials[currentIndex].content}"
          </blockquote>
          
          <div className="flex items-center justify-center space-x-4">
            <img 
              src={testimonials[currentIndex].image}
              alt={testimonials[currentIndex].name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="text-left">
              <div className="font-semibold text-neutral-900">{testimonials[currentIndex].name}</div>
              <div className="text-neutral-600">{testimonials[currentIndex].role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-neutral-600 hover:text-orange-500 hover:shadow-xl transition-all duration-300 z-10"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-neutral-600 hover:text-orange-500 hover:shadow-xl transition-all duration-300 z-10"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-orange-500 w-8' 
                : 'bg-neutral-300 hover:bg-neutral-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;

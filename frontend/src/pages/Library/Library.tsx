import DeckFormModal from './components/DeckFormModal';
import { useLibrary } from './hooks/useLibrary';
import { LIBRARY_TABS } from '../../shared/constants/app.constants';
import LibraryBanner from './components/LibraryBanner';
import FeaturedDecks from './components/FeaturedDecks';
import LibraryToolbar from './components/LibraryToolbar';
import DeckGrid from './components/DeckGrid';

export default function Library() {
  const {
    CAROUSEL_IMAGES, DAILY_IMAGES, ITEMS_PER_PAGE,
    activeTab, setActiveTab,
    isLoading, currentSlide, setCurrentSlide,
    searchQuery, setSearchQuery,
    isDeckModalOpen, setIsDeckModalOpen,
    targetDeck, setTargetDeck,
    activeMenuId, setActiveMenuId,
    currentPage, setCurrentPage,
    visibleDecks, totalPages, paginatedDecks,
    carouselDecks, dailyDeck,
    fetchDecks, handleDeleteDeck
  } = useLibrary();

  return (
    <div className="animate-fade-in pb-20 w-full max-w-[1200px] mx-auto">
      
      <LibraryBanner />

      {!isLoading && (
        <FeaturedDecks 
          carouselDecks={carouselDecks} 
          dailyDeck={dailyDeck}
          currentSlide={currentSlide} 
          setCurrentSlide={setCurrentSlide}
          CAROUSEL_IMAGES={CAROUSEL_IMAGES} 
          DAILY_IMAGES={DAILY_IMAGES} 
        />
      )}

      <div>
        <LibraryToolbar 
          tabs={LIBRARY_TABS} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          setCurrentPage={setCurrentPage}
        />

        <DeckGrid 
          isLoading={isLoading}
          activeTab={activeTab}
          searchQuery={searchQuery}
          currentPage={currentPage}
          totalPages={totalPages}
          paginatedDecks={paginatedDecks}
          visibleDecksLength={visibleDecks.length}
          itemsPerPage={ITEMS_PER_PAGE}
          activeMenuId={activeMenuId}
          setActiveMenuId={setActiveMenuId}
          setTargetDeck={setTargetDeck}
          setIsDeckModalOpen={setIsDeckModalOpen}
          handleDeleteDeck={handleDeleteDeck}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <DeckFormModal 
        isOpen={isDeckModalOpen}
        deck={targetDeck}
        onClose={() => setIsDeckModalOpen(false)}
        onSuccess={fetchDecks}
      />
    </div>
  );
}
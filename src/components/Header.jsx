// import { useEffect, useRef, useState } from "react";
// import { Menu as MenuIcon, Search as SearchIcon, ArrowLeft } from "lucide-react";

// const Header = () => {
//   const [showSearch, setShowSearch] = useState(false)
//   const [showSticky, setShowSticky] = useState(false); // toggles fixed/sticky
//   const [isSearching, setIsSearching] = useState(false); // toggles expanded search UI
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 50) {
//         setShowSearch(true)
//       } else {
//         setShowSearch(false)
//       }
//     }

//     window.addEventListener("scroll", handleScroll)

//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])


// useEffect(() => {
//     const onScroll = () => {
//       // show sticky header once user scrolls a bit (adjust threshold as needed)
//       setShowSticky(window.scrollY > 48);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     if (isSearching && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isSearching]);

//   // container position: if sticky -> fixed at top; otherwise render in-flow with mt-4
//   const containerPositionClass = showSticky ? "fixed top-4 left-4 right-4 z-50" : "relative mt-4";


//   return (
//     <>
//     <div className='hidden fixed top-0 left-0 md:flex w-full justify-between items-center py-4 px-8 bg-white z-50 gap-6'>
        
//       {/* Logo */}
//       <img src='./Logo.svg' alt='logo' width={100} height={100}/>

//       {/* NAVIGATION LIST — hidden when scrolling */}
//       {!showSearch && (
//         <ul className='flex gap-6 text-gray-700 font-normal text-md items-center transition-all duration-300'>
//           <li>How it works</li>
//           <li>About us</li>
//           <li>FAQs</li>
//           <li>Contact</li>
//         </ul>
//       )}

//       {/* SEARCH — visible when scrolling */}
//       {showSearch && (
//         <div className='flex relative items-center w-full max-w-[350px] border-[0.5px] rounded-full px-4 py-2 transition-all ease-in duration-300'>
//           <Search size={16} className='absolute left-4 text-gray-500'/>
//           <input 
//             type='text' 
//             placeholder='search...' 
//             className='w-full pl-8 outline-none bg-transparent text-sm'
//           />
//         </div>
//       )}
//       {/* Get Started button */}
//       <button className='flex rounded-3xl py-2 px-3 border bg-blue-700 text-white font-medium text-sm'>
//         Get started
//       </button>
//     </div>
//     <div className={`md:hidden ${containerPositionClass} px-2`}>
//       {/* small padding wrapper so fixed element doesn't touch edges */}

//       {/* ---------- COMPACT / DEFAULT HEADER ---------- */}
//       {!isSearching && (
//         <div
//           className={`
//             flex items-center justify-between w-full
//             border border-gray-300 rounded-full
//             px-4 py-2 transition-all duration-300 ease-in-out
//             bg-white/60 backdrop-blur-sm shadow-sm
//           `}
//           aria-hidden={isSearching}
//         >
//           {/* left: menu + logo */}
//           <div className="flex items-center gap-2">
//             <div
//               className="flex items-center justify-center rounded-full w-8 h-8 p-2 bg-[#E8E8E8]"
//               aria-hidden
//             >
//               <MenuIcon size={16} />
//             </div>

//             {/* logo - change path as needed */}
//             <img src="./Logo2.svg" alt="logo" width={70} height={70} />
//           </div>

//           {/* middle: faux-input (clicking opens the expanded search) */}
//           <button
//             onClick={() => setIsSearching(true)}
//             className="flex-1 mx-3 min-w-0 text-left"
//             aria-label="Open search"
//             type="button"
//           >
//             <div
//               className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-full bg-transparent border border-transparent
//                          text-sm text-gray-600 w-full"
//             >
//               <SearchIcon size={18} className="text-gray-600" />
//               <span className="truncate text-sm text-gray-500">Search</span>
//             </div>
//           </button>

//           {/* right: CTA */}
//           <div className="flex items-center">
//             <button
//               className="rounded-3xl py-2 px-3 border bg-blue-700 text-white font-medium text-sm"
//               type="button"
//             >
//               Get started
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ---------- EXPANDED SEARCH UI ---------- */}
//       {isSearching && (
//         <div
//           className={`
//             w-full transition-all duration-300 ease-in-out
//             bg-white/75 backdrop-blur-md border border-gray-200 rounded-full px-3 py-3 flex items-center gap-3
//             shadow-md
//           `}
//         >
//           {/* back arrow (matches screenshot) */}
//           <button
//             onClick={() => setIsSearching(false)}
//             aria-label="Close search"
//             className="flex items-center justify-center p-1"
//             type="button"
//           >
//             <ArrowLeft size={22} className="text-gray-700" />
//           </button>

//           {/* input: left aligned like your second screenshot */}
//           <div className="flex-1 min-w-0">
//             <input
//               ref={inputRef}
//               type="text"
//               placeholder="Search"
//               className="w-full bg-transparent outline-none text-[16px] placeholder:text-gray-500"
//             />
//           </div>

//           {/* optional trailing search icon (keeps visuals from screenshot) */}
//           <div className="flex items-center justify-center p-1">
//             <SearchIcon size={18} className="text-gray-700" />
//           </div>
//         </div>
//       )}
//     </div>
//     </>
//   )
// }

// export default Header



import { useEffect, useRef, useState } from "react";
import { Menu as MenuIcon, Search as SearchIcon, ArrowLeft } from "lucide-react";

const Header = () => {
  const [showSticky, setShowSticky] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShowSticky = window.scrollY > 48;
      setShowSticky(shouldShowSticky);
      // Show search button only when scrolled and not actively searching
      setShowSearchButton(shouldShowSticky && !isSearching);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSearching]);

  useEffect(() => {
    if (isSearching && inputRef.current) {
      inputRef.current.focus();
      // Hide search button when actively searching
      setShowSearchButton(false);
    }
  }, [isSearching]);

  // Reset search button state when closing search
  const handleCloseSearch = () => {
    setIsSearching(false);
    // Only show search button if we're still scrolled
    setShowSearchButton(window.scrollY > 48);
  };

  const containerPositionClass = showSticky || isSearching 
    ? "fixed top-0 left-0 right-0 z-50 px-4 py-2 bg-white/75 backdrop-blur-md" 
    : "relative mt-4 px-2";

  return (
    <>
      {/* Desktop Header - unchanged from your original */}
      <div className='hidden fixed top-0 left-0 md:flex w-full justify-between items-center py-4 px-8 bg-white z-50 gap-6'>
        <img src='./Logo.svg' alt='logo' width={100} height={100}/>

        {!showSticky && (
          <ul className='flex gap-6 text-gray-700 font-normal text-md items-center transition-all duration-300'>
            <li>How it works</li>
            <li>About us</li>
            <li>FAQs</li>
            <li>Contact</li>
          </ul>
        )}

        {showSticky && (
          <div className='flex relative items-center w-full max-w-[350px] border-[0.5px] rounded-full px-4 py-2 transition-all ease-in duration-300'>
            <SearchIcon size={16} className='absolute left-4 text-gray-500'/>
            <input 
              type='text' 
              placeholder='search...' 
              className='w-full pl-8 outline-none bg-transparent text-sm'
            />
          </div>
        )}
        
        <button className='flex rounded-3xl py-2 px-3 border bg-blue-700 text-white font-medium text-sm'>
          Get started
        </button>
      </div>

      {/* Mobile Header */}
      <div className={`md:hidden ${containerPositionClass}`}>
        {/* ---------- COMPACT / DEFAULT HEADER ---------- */}
        {!isSearching && (
          <div className="flex items-center justify-between w-full border border-gray-300 rounded-full px-4 py-2 bg-white/60 backdrop-blur-sm shadow-sm">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-full w-8 h-8 p-2 bg-[#E8E8E8]">
                <MenuIcon size={16} />
              </div>
              <img src="./Logo2.svg" alt="logo" width={70} height={70} />
            </div>

            {/* Middle: Search trigger area - only show when not showing search button */}
            {!showSearchButton && (
              <button
                onClick={() => setIsSearching(true)}
                className="flex-1 mx-3 min-w-0 text-left"
                aria-label="Open search"
                type="button"
              >
                <div className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-full bg-transparent border border-transparent text-sm text-gray-600 w-full">
                  <SearchIcon size={18} className="text-gray-600" />
                  <span className="truncate text-sm text-gray-500">Search</span>
                </div>
              </button>
            )}

            {/* Right: Either Get Started button or Search Icon */}
            <div className="flex items-center">
              {showSearchButton ? (
                // Show search icon button when scrolled
                <button
                  onClick={() => setIsSearching(true)}
                  className="flex items-center justify-center rounded-full w-10 h-10 p-2 bg-slate-100 text-slate-400"
                  aria-label="Open search"
                  type="button"
                >
                  <SearchIcon size={18} />
                </button>
              ) : (
                // Show Get Started button when not scrolled
                <button
                  className="rounded-3xl py-2 px-3 border bg-blue-700 text-white font-medium text-sm"
                  type="button"
                >
                  Get started
                </button>
              )}
            </div>
          </div>
        )}

        {/* ---------- EXPANDED SEARCH UI ---------- */}
        {isSearching && (
          <div className="w-full bg-white/75 backdrop-blur-md border border-gray-200 rounded-full px-3 py-3 flex items-center gap-3 shadow-md">
            {/* Back arrow */}
            <button
              onClick={handleCloseSearch}
              aria-label="Close search"
              className="flex items-center justify-center p-1"
              type="button"
            >
              <ArrowLeft size={22} className="text-gray-700" />
            </button>

            {/* Search input */}
            <div className="flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent outline-none text-[16px] placeholder:text-gray-500"
              />
            </div>

            {/* Optional trailing search icon */}
            <div className="flex items-center justify-center p-1">
              <SearchIcon size={18} className="text-gray-700" />
            </div>
          </div>
        )}
      </div>

      {/* Add spacing for fixed header */}
      {(showSticky || isSearching) && <div className="h-16 md:hidden"></div>}
    </>
  )
}

export default Header
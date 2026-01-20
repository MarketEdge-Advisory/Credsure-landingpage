import React from 'react'

const DefaultLayout = ({ header, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-10">
        {header}
      </header>
      <main className="flex-1 mt-16">
        {children}
      </main>
    </div>
  )
}

export default DefaultLayout

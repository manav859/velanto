import type { ReactNode } from 'react'
import AnnouncementBar from './AnnouncementBar'
import Header from './Header'
import Footer from './Footer'

type Props = { children: ReactNode }

/**
 * Standard page wrapper — AnnouncementBar + sticky Header + main + Footer.
 * Use for all non-homepage content pages to keep layout consistent.
 */
export default function PageShell({ children }: Props) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}

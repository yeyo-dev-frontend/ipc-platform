import { AnimatePresence } from "motion/react"
import { Route, Routes } from "react-router-dom"
//compoennte de carga
import { PageLoader } from "./components/molecules/shared/pageLoader"

//Animacion y trancicion
import { MainLayout } from "./components/layouts/mainLayout"

/* Páginas */
import { HomePage } from "./components/pages/homePage"
import { AlumniPage } from "./components/pages/alumniPage"
import { AboutUsPage } from "./components/pages/aboutUsPage"
import { EventsPage } from "./components/pages/eventsPage"
import { AdmissionPage } from "./components/pages/admissionsPage"
import { PrivacyPage } from "./components/pages/privacyPage"
import {StudentLivePage } from "./components/pages/studentLivePage"

/* Carreras */
import { AdministrationPage } from "@/components/pages/careers/administration/businessAdministrationPage"
import { AccountingPage } from "./components/pages/careers/accounting/accountingPage"
import { ComputerSciencePage } from "@/components/pages/careers/computerScience/computerSciencePage"
import { LanguageTranslationPage } from "@/components/pages/careers/languageTranslation/languageTranslationPage"
import { SocialFloatings } from "./components/molecules/shared/SocialsFloatings"

function App() {


  const pages = [
    { path: '/', element: <HomePage /> },
    { path: '/alumni', element: <AlumniPage /> },
    { path: '/about-us', element: <AboutUsPage /> },
    { path: '/events', element: <EventsPage /> },
    { path: '/admissions', element: <AdmissionPage /> },
    { path: '/privacy', element: <PrivacyPage /> },
    { path: '/student-life', element: <StudentLivePage /> },

    // Carreras
    { path: '/career/administration', element: <AdministrationPage /> },
    { path: '/career/accounting', element: <AccountingPage /> },
    { path: '/career/computer-science', element: <ComputerSciencePage /> },
    { path: '/career/language-translation', element: <LanguageTranslationPage /> },
  ]

  return (
    <>
      <PageLoader/>
      <SocialFloatings />
      <AnimatePresence mode="wait" initial={false}>
        <Routes>
          <Route element={<MainLayout />}>
            {pages.map((page, p) => (
              <Route
                key={p}
                path={page.path}
                element={page.element}
              />
            ))}
          </Route>
        </Routes>

      </AnimatePresence></>
  )
}
export default App

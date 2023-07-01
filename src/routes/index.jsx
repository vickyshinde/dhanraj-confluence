import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = lazy(() => import("../App"));
const AddPage = lazy(() => import("../components/addPage"));
const ListingPage = lazy(() => import("../components/ListingPage"));
const ErrorPage = lazy(() => import("../components/ErrorPage"));

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback="...Loader">
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/" element={<AddPage />} />
            <Route path="/listing" element={<ListingPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;

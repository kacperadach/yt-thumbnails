import ReactGA from "react-ga4";

const GOOGLE_ANALYTICS_TRACKING_ID = "G-FYCY190G0V";

function isGaEnabled() {
  return process.env.REACT_APP_GA_ENABLED === "true";
}

export const initializeAnalytics = () => {
  if (isGaEnabled()) {
    ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_ID);
  }
};

// export const handleRouteChange = (url: URL) => {
//   if (isGaEnabled()) {
//     ReactGA.send({ hitType: "pageview", page: url });
//   }
// };

// export const setGAUserId = (userId: string) => {
//   if (isGaEnabled()) {
//     ReactGA.set({ user_id: userId });
//   }
// };

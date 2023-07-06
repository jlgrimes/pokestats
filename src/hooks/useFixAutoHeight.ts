import { useEffect } from "react";

export const useFixAutoHeight = (additionalIds?: string[]) => {
  useEffect(() => {
    const targetIds = ['__next', 'app-layout-container', 'tournament-page-layout', ...(additionalIds ?? [])];

    for (const id of targetIds) {
      let wrapper = document.getElementById(id)
      if (!wrapper) return;

      const observer = new MutationObserver(function (mutations, observer) {
        if (!wrapper) return;

        wrapper.style.height = ''
        wrapper.style.minHeight = ''
      })
      observer.observe(wrapper, {
        attributes: true,
        attributeFilter: ['style']
      })
    }
  }, []);
}
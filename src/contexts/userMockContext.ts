import { createContext } from "react";

export const userMockContext = createContext({
  shouldMockUser: false,
  setShouldMockUser: (should: boolean) => {}
});
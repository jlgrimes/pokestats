import { LinkBox, LinkOverlay } from "@chakra-ui/react"
import { HeartIcon } from "@heroicons/react/outline"
import { Bold, Callout, Icon } from "@tremor/react"
import { FaExternalLinkAlt } from "react-icons/fa"
import { trackEvent } from "../../lib/track"

export const SupportUsCallout = () => {
  return (
    <LinkBox>
    <LinkOverlay href='https://www.patreon.com/bePatron?u=97204202' isExternal onClick={() => trackEvent('Patreon Link clicked')}>
      <Callout title='Support us to remove ads!' icon={HeartIcon} color='pink' className="dark:bg-pink-900 dark:text-pink-200">Remove all ads site-wide by supporting us on <Bold>Patreon</Bold> <Icon size='xs' icon={FaExternalLinkAlt} color='pink' /></Callout>
        </LinkOverlay>
    </LinkBox>
  )
}
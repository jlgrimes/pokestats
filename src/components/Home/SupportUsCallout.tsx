import { LinkBox, LinkOverlay } from "@chakra-ui/react"
import { HeartIcon } from "@heroicons/react/outline"
import { Bold, Callout, Icon } from "@tremor/react"
import { FaExternalLinkAlt } from "react-icons/fa"

export const SupportUsCallout = () => {
  return (
    <LinkBox>
    <LinkOverlay href='https://www.patreon.com/bePatron?u=97204202' isExternal>
      <Callout title='Support Pokéstats Live' icon={HeartIcon} color='pink' className="dark:bg-pink-900 dark:text-pink-200">Support development through <Bold>Patreon</Bold> <Icon size='xs' icon={FaExternalLinkAlt} color='pink' /> to help keep the site available - thank you!</Callout>
        </LinkOverlay>
    </LinkBox>
  )
}
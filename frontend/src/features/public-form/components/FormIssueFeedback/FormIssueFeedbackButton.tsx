import { BiMessage } from 'react-icons/bi'
import { Flex, Portal, useDisclosure } from '@chakra-ui/react'

import { noPrintCss } from '~utils/noPrintCss'
import IconButton from '~components/IconButton'
import Tooltip from '~components/Tooltip'

import { usePublicFormContext } from '~features/public-form/PublicFormContext'

import { FormIssueFeedbackModal } from './FormIssueFeedbackModal'

export const FormIssueFeedbackButton = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isPreview } = usePublicFormContext()

  return (
    <Portal>
      <Flex
        position="fixed"
        bottom="2.75rem"
        right="2.75rem"
        cursor="pointer"
        sx={noPrintCss}
      >
        <Tooltip placement="left" label="Report an issue">
          <IconButton
            variant="outline"
            as="a"
            aria-label="issue feedback"
            icon={<BiMessage color="primary.500" />}
            onClick={onOpen}
          />
        </Tooltip>
        <FormIssueFeedbackModal
          isOpen={isOpen}
          onClose={onClose}
          isPreview={isPreview}
        />
      </Flex>
    </Portal>
  )
}

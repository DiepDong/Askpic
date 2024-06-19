import { Alert, CopyButton, Tooltip, rem, ActionIcon, Flex } from '@mantine/core';
import { IconHelp, IconCopy, IconCheck } from '@tabler/icons-react';
import appStrings from '../../utils/strings';
export default function ExtraLink({title}) {
  const icon = <IconHelp />;
  return (
    <Alert variant="light" color="grape" radius="xs" title={appStrings.language.addAlert.title} icon={icon}>
        <Flex
        align='center'
        gap='0.5rem'>
          {appStrings.language.addAlert.message}
          <CopyButton value={title} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
              <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                {copied ? (
                  <IconCheck style={{ width: rem(16) }} />
                ) : (
                  <IconCopy style={{ width: rem(16) }} />
                )}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Flex>
    </Alert>
  );
}
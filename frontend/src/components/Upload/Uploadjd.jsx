import { Alert, FileButton, Button, Group} from '@mantine/core';
import { useState } from 'react';
import { Title } from '@mantine/core';
import appStrings from '../../utils/strings';

export default function Uploadjd() {
  const [file, setFile] = useState(null);

  return (
    <Alert variant="light" color="blue">
      <Group justify="space-between" align='center'>
        <div>
        <Title order={4}>{appStrings.language.uploadJd.title}</Title>
          {appStrings.language.uploadJd.message}
        </div>
        <FileButton onChange={setFile} accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
        {(props) => <Button {...props}>{appStrings.language.uploadJd.upload}</Button>}
        </FileButton>
      </Group>
    </Alert>
  );
}
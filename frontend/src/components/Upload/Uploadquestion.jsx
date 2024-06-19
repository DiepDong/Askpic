import { Alert, FileButton, Button, Group} from '@mantine/core';
import { useState } from 'react';
import { Title } from '@mantine/core';
import appStrings from '../../utils/strings';
export default function Uploadqu() {
  const [file, setFile] = useState(null);

  return (
    <Alert variant="light" color="blue">
      <Group justify="space-between" align='center'>
        <div>
        <Title order={4}>{appStrings.language.uploadQuestion.title}</Title>
          {appStrings.language.uploadQuestion.message}
        </div>
          <FileButton onChange={setFile} accept="application/json">
          {(props) => <Button {...props}>{appStrings.language.uploadQuestion.upload}</Button>}
          </FileButton>
      </Group>
    </Alert>
  );
}
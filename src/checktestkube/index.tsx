import { SectionBox } from '@kinvolk/headlamp-plugin/lib/components/common';
import { Link } from '@mui/material';

export function NotSupported(props: { typeName: string }) {
  const { typeName } = props;
  return (
    <SectionBox title={typeName}>
      <p>Testkube installation has no support for {typeName}.</p>
      <p>
        Follow the{' '}
        <Link target="_blank" href="https://docs.testkube.io/articles/test-workflows">
          guide
        </Link>{' '}
      </p>
    </SectionBox>
  );
}

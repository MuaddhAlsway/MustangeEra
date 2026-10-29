import { termsDraft } from '../../features/legal/drafts';
import LegalPageLayout from './LegalPageLayout';

export default function TermsPage() {
  return <LegalPageLayout document={termsDraft} />;
}

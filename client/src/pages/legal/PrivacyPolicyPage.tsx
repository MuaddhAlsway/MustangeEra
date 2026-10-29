import { privacyDraft } from '../../features/legal/drafts';
import LegalPageLayout from './LegalPageLayout';

export default function PrivacyPolicyPage() {
  return <LegalPageLayout document={privacyDraft} />;
}

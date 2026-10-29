import { PublishedContent } from '../../lib/PublicData';
import WhyMustangGarage from '../Home/WhyMustangGarage';
import CollectionFocus from './CollectionFocus';
import CuratingStandard from './CuratingStandard';
import OriginStory from './OriginStory';
import PeopleBehindGarage from './PeopleBehindGarage';
import VisitGarage from './VisitGarage';

export default function About() {
  return (
    <main>
      <OriginStory />
      <PublishedContent page="about"/>
      <WhyMustangGarage />
      <CuratingStandard />
      <CollectionFocus/>
      <PeopleBehindGarage/>
      <VisitGarage/>
    </main>
  );
}

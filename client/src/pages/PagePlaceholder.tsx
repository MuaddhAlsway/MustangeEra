import { Link } from 'react-router-dom';
import '../styles/PagePlaceholder.css';

type PagePlaceholderProps = {
  title: string;
  description: string;
};

export default function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <main className="mg-page-placeholder">
      <p>MUSTANG GARAGE / COMING SOON</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link to="/inventory">Explore the inventory →</Link>
    </main>
  );
}

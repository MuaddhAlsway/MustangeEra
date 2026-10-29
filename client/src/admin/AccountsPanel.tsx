import type { AdminProps } from './adminState';
import { Badge, Empty } from './AdminUI';

export default function AccountsPanel({state}:AdminProps){
 const users=state.users??[];
 return <section><div className="mg-admin-section-top"><div><h2>Clerk accounts saved in MongoDB</h2><p>Accounts are recorded after a verified Clerk session calls the server sync endpoint. Admin access still comes only from the server’s verified ADMIN_EMAILS allowlist.</p></div><Badge>{users.length} accounts</Badge></div>{users.length===0?<Empty title="No signed-in accounts have synced yet.">A successful sign-in will create its record in the users collection.</Empty>:<div className="mg-admin-table-wrap"><table><thead><tr><th>Account</th><th>Email</th><th>Server role</th><th>Last login sync</th></tr></thead><tbody>{users.map(user=><tr key={user.id}><td>{user.name||'Clerk account'}</td><td>{user.email||'No email provided'}</td><td><Badge>{user.role}</Badge></td><td>{user.lastLoginAt?new Date(user.lastLoginAt).toLocaleString():'—'}</td></tr>)}</tbody></table></div>}</section>;
}

import { useContext, useEffect } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { getUnixTime } from 'date-fns';
import { toDate } from 'date-fns-tz';

import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';

interface PropTypes {
  children: any;
}

export function IntercomStateManager({ children }: PropTypes) {
  const { user } = useAuth0();
  const { account } = useContext(UserAccountContext);

  useEffect(() => {
    const appId = process.env.REACT_APP_INTERCOM_APP_ID;

    if (appId) {
      const w = window as any;
      w.Intercom('shutdown');
      // 'shutdown' does not reset session after log out. maybe it's a bug
      w.Intercom('boot', {
        app_id: appId,
        session_duration: 0,
      });

      w.Intercom('shutdown');
      w.Intercom('boot', {
        app_id: appId,
        name: user?.name,
        email: user?.email,
        created_at: account?.createdAt ? getUnixTime(toDate(account.createdAt)) : null,
      });
    }
  }, [account, user]);

  return children;
}
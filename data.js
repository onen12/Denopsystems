/* Data layer. The UI talks ONLY to window.Data.
   Later, to move to Supabase, replace the internals of these methods (keep names + return shapes). */
(() => {
  const call = async (method, url, body) => {
    const r = await fetch('/api/' + url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    let j; try { j = await r.json(); } catch { throw Object.assign(new Error('Cannot reach the Denop server. Run “node server.js” or deploy as a Web Service (not a Static Site).'), { status: 0 }); }
    if (!r.ok) throw Object.assign(new Error(j.error || 'Something went wrong'), { status: r.status });
    return j;
  };
  window.Data = {
    me: () => call('GET', 'me'),
    login: (email, password) => call('POST', 'login', { email, password }),
    logout: () => call('POST', 'logout'),
    changePassword: (current, password) => call('POST', 'change-password', { current, password }),
    updateProfile: (name, phone) => call('PATCH', 'profile', { name, phone }),
    photoUrl: (jobId, n) => `/api/photo/${jobId}/${n}`,
    marketer: {
      summary: () => call('GET', 'm/summary'),
      addClient: b => call('POST', 'm/clients', b),
      withdraw: b => call('POST', 'm/withdraw', b),
    },
    installer: {
      jobs: () => call('GET', 'i/jobs'),
      start: id => call('POST', `i/jobs/${id}/start`),
      complete: (id, photos, notes) => call('POST', `i/jobs/${id}/complete`, { photos, notes }),
    },
    admin: {
      overview: () => call('GET', 'a/overview'),
      addUser: b => call('POST', 'a/users', b),
      patchUser: (id, b) => call('PATCH', 'a/users/' + id, b),
      addJob: b => call('POST', 'a/jobs', b),
      assign: (id, installerId) => call('PATCH', 'a/jobs/' + id, { installerId }),
      resolveWithdrawal: (id, status) => call('PATCH', 'a/withdrawals/' + id, { status }),
    },
  };
})();

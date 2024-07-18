import React from 'react';

function ContactsContactIdEdit() {
    return (
        <>
            <div>This route is without underscore. <b>contacts.$contactId.edit.tsx</b></div>
            <div>It is rendered only if we use <b>{'<Outlet/>'}</b></div>
            <div>It is <b>/edits</b> in order to avoid route collision.</div>
        </>
    );
}

export default ContactsContactIdEdit;

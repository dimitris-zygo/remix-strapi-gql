import React from 'react';

function ContactsContactIdEdit() {
    return (
        <>
            <div>This route is with underscore. <b>contacts.$contactId_.edit.tsx</b></div>
            <div>When we use underscore it creates a new route.</div>
            <div>And it doesn't nest inside the <b>contacts.$contactId.tsx</b> </div>
            <div>No outlet.</div>
        </>
    );
}

export default ContactsContactIdEdit;

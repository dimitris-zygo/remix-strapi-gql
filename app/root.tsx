import {
     isRouteErrorResponse, Link,
    Links,
    Meta, Outlet,
    Scripts,
    ScrollRestoration, useLoaderData, useNavigate, useRouteError, useSearchParams,
} from "@remix-run/react";
import "./app.css";
import client from "../client/urqlClient";
import {json} from "@remix-run/node";
import React from "react";

export const GET_CONTACTS = `
  query GetPromotions($locale: I18NLocaleCode) {
    promotions(locale: $locale) {
      data {
        id
        attributes {
            title
            image
        }
      }
    }
  }
`;

export type PromotionType = {
    id:string;
    attributes: {
        title:string;
        image:string;
    }
}

export async function loader({request}) {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'en';
    const result = await client.query(GET_CONTACTS, {
        locale,
    },{ requestPolicy: 'network-only' }).toPromise();

    if (result.error) {
        throw new Response(result.error.message,{status:500});
    }

    return json(result.data);
}

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
      <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="root-error">
      <div>
        <h1>It seems there is an error.</h1>
        <p>
          {isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}`
              : error instanceof Error
                  ? error.message
                  : "Unknown Error"}
        </p>
        <button onClick={() => navigate(-1)}>Back to safety</button>
      </div>
      <Scripts/>
      </body>
      </html>
  );
}

export default function App() {
   const {promotions} = useLoaderData<typeof loader>() as PromotionType;
   const [locale,setLocale] = React.useState('en');
   const [,setSearchParams] = useSearchParams();

  const handleLocaleChange = (newLocale) => {
      setLocale(newLocale);
      setSearchParams({locale:newLocale});
  }
  return (
      <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Promotions</h1>
            <div>
                <select onChange={(e) => handleLocaleChange(e.target.value)} value={locale}>
                    <option value="en">English</option>
                    <option value="fi">Finnish</option>
                </select>
            </div>
            <nav>
                {promotions.data.length ? (
                    <ul>
                        {promotions.data.map((promotion) => {
                            return (
                                <li key={promotion.id}>
                                    <Link to={`promotions/${promotion.id}`} className="link-class">
                                        {promotion.attributes.title}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
            ) : (
                <p>
                  <i>No promotions</i>
                </p>
            )}
          </nav>
        </div>
      <div id="detail">
        <Outlet/>
      </div>
      <ScrollRestoration/>
      <Scripts/>
      </body>
      </html>
  );
}

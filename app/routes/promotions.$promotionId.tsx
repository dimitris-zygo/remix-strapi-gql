import {Outlet, useLoaderData} from "@remix-run/react";
import {json, type LoaderFunctionArgs} from "@remix-run/node";
import invariant from "tiny-invariant";
import client from "../../client/urqlClient";
import {PromotionType} from "~/root";

const GET_PROMOTION = `
    query Promotion($id:ID,$locale:I18NLocaleCode){
      promotion(id:$id,locale:$locale){
        data {
          attributes {
            title 
            desc
            image
          }
        }
      }
    }
`

export async function loader({ params } :LoaderFunctionArgs){
    invariant(params.promotionId,"Missing promotionId param");
    const promotionId = params.promotionId;
    const result = await client.query(GET_PROMOTION,{id:promotionId, locale:"fi"},{ requestPolicy: 'network-only' }).toPromise();
    if (!result) throw new Response("Not Found",{status:404});

    return json(result.data);
}

export default function Promotion() {
    const {promotion} = useLoaderData<typeof loader>() as PromotionType;
    const p = promotion.data.attributes;

    return (
        <>
            <div id="contact">
                    <img
                        alt="image"
                        key={p.image}
                        src={p.image}
                    />
                <div>
                    <h1>{p.title}</h1>
                    <p>{p.desc}</p>
                </div>
            </div>
            <Outlet/>
        </>

    );
}

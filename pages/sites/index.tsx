import React, { useState, useRef, useEffect } from 'react'
import { CSVLink } from "react-csv";
import Layout from "../../components/Layout";
import Link from "next/link";
import { NextPage } from "next";
import axios from "axios";
import Router from "next/router";
import Loader from "../../components/Loader";
import { authenticate } from "../../utils/auth";
import Site from "../../components/Site";

interface Props {
  authenticated: boolean;
  authToken: string;
  sites: any;
  pagination: any;
}

const Sites: NextPage<Props> = (props) => {
  if (process.browser && !props.authToken) Router.push("/signin");

  const [searchWord, setSearchWord] = useState('')
  const [csv, setCsv] = useState<any>({
    data: [],
    headers: [],
    filename: 'Clue_Mediator_Report.csv'
  })
  const csvRef = useRef<{ link: HTMLAnchorElement }>(null);

  useEffect(() => {
    console.log(csv)
    if (!csv.data.length) return () => {}

    setTimeout(() => {
      if (csvRef && csvRef.current) {
        csvRef.current.link.click()
      }
    }, 1000)
  }, [csv])

  const onChange = (ev: any) => {
    setSearchWord(ev.target.value)
  }

  const handleSearch = () => {
    Router.push(`/sites?word=${searchWord}`)
  }

  const addCsv = async () => {
    const headers = [
      { label: "Account ID", key: "accountId" },
      { label: "Account Name", key: "accountName" },
      { label: "Active Licenses", key: "activeLicenses" },
      { label: "Created At", key: "createdAt" },
      { label: "Creator", key: "creator" },
      { label: "Creator ID", key: "creatorId" },
      { label: "Expiration", key: "expiration" },
      { label: "External ID", key: "externalId" },
      { label: "Health Status", key: "healthStatus" },
      { label: "ID", key: "id" },
      { label: "Is Default", key: "isDefault" },
      { label: "Name", key: "name" },
      { label: "Registration Token", key: "registrationToken" },
      { label: "Site Type", key: "siteType" },
      { label: "Sku", key: "sku" },
      { label: "Slack Integrated", key: "slackIntegrated" },
      { label: "State", key: "state" },
      { label: "Suite", key: "suite" },
      { label: "Total Licenses", key: "totalLicenses" },
      { label: "Unlimited Expiration", key: "unlimitedExpiration" },
      { label: "Unlimited Licenses", key: "unlimitedLicenses" },
      { label: "Updated At", key: "updatedAt" }
    ];

    const { data: { data }} = await axios.get(`${process.env.S1_CENTRAL_ENDPOINT}/chat-agents/csv`, {
      headers: {
        Authorization: `Bearer ${props.authToken}`,
      },
    });

    const csvReport = {
      data: data,
      headers: headers,
      filename: 'Clue_Mediator_Report.csv'
    };

    return csvReport
  }

  return (
    <>
      {props.authenticated ? (
        <Layout authenticated={props.authenticated}>
          <div className="mt-4">
            <input className="px-4 py-2 bg-gray-800 text-white" value={searchWord} onChange={onChange} />
            <button className="bg-indigo-700 text-white px-4 py-2" onClick={handleSearch}>検索</button>
          </div>
          <button className="bg-indigo-700 text-white px-4 py-2 mt-2" onClick={async () => {
            setCsv(await addCsv())
          }}>Export CSV</button>
          <CSVLink ref={csvRef} {...csv}></CSVLink>

          <section className="py-4">
            <ul>
              {props.sites.map((site: any) => (
                <Site key={site.id} site={site} authToken={props.authToken} />
              ))}
            </ul>
          </section>
          <section className="flex justify-between mb-12 px-4 md:px-0">
            {props.pagination.totalItems !== 0 && (
              <span className="text-gray-600">
                Total {props.pagination.totalItems} Items
              </span>
            )}
            {props.pagination.nextCursor && (
              <Link href={`/sites?word=${searchWord ? searchWord : ''}&cursor=${props.pagination.nextCursor}`}>
                <a className="bg-gray-800 text-gray-200 py-1 px-2 rounded">
                  NEXT
                </a>
              </Link>
            )}
          </section>
        </Layout>
      ) : (
        <Loader />
      )}
    </>
  );
};

Sites.getInitialProps = async function (context) {
  const { authenticated, authToken } = authenticate(context);
  let _sites = null;
  let _pagination = null;

  if (authToken) {
    const { cursor, word } = context.query;
    const addCursorParams = cursor ? { cursor } : {};
    const addWordParams = word ? { ...addCursorParams, word } : { ...addCursorParams }

    const {
      data: {
        data: {
          data: { sites },
          pagination,
        },
      },
    } = await axios.get(`${process.env.S1_CENTRAL_ENDPOINT}/sites/search`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: addWordParams,
    });

    _sites = sites;
    _pagination = pagination;
  }

  return {
    sites: _sites,
    pagination: _pagination,
    authToken,
    authenticated,
  };
};

export default Sites;

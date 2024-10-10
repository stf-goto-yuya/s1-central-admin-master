import Layout from "../../components/Layout";
import axios from "axios";
import Router from "next/router";
import moment from "moment";
import { authenticate } from "../../utils/auth";
import Loader from "../../components/Loader";

const Tag = ({ value, active }) => (
  <>
    {active ? (
      <span className="bg-blue-800 py-1 px-2 rounded-full text-xs text-blue-100">
        {value}
      </span>
    ) : (
      <span className="bg-pink-800 py-1 px-2 rounded-full text-xs text-pink-100">
        {value}
      </span>
    )}
  </>
);

const SiteField = ({ field, value }) => (
  <li className="w-full md:w-1/2 p-2 shadow-lg">
    <div className="border border-gray-800 py-2 px-4">
      <small className="text-gray-500 font-bold">{field}</small>
      <p className="text-gray-600">{value ? value : "N/A"}</p>
    </div>
  </li>
);

const SiteHealthStatusField = ({ field, value }) => (
  <li className="w-full md:w-1/2 p-2 shadow-lg">
    <div className="border border-gray-800 py-2 px-4">
      <small className="text-gray-500 font-bold">{field}</small>
      <p className="text-gray-600">
        {value ? <Tag value={`Health`} active /> : <Tag value={`UnHealth`} />}
      </p>
    </div>
  </li>
);

const SiteIsDefaultField = ({ field, value }) => (
  <li className="w-full md:w-1/2 p-2 shadow-lg">
    <div className="border border-gray-800 py-2 px-4">
      <small className="text-gray-500 font-bold">{field}</small>
      <p className="text-gray-600">
        {value ? (
          <Tag value={`Default`} active />
        ) : (
          <Tag value={`Not Default`} />
        )}
      </p>
    </div>
  </li>
);

const SiteDetail = (props) => {
  if (process.browser && !props.authToken) Router.push("/signin");

  return (
    <>
      {props.authenticated ? (
        <Layout authenticated={props.authenticated}>
          <section className="py-4">
            <section className="border border-gray-800 py-4 px-8 shadow-lg mb-4">
              <h1 className="text-gray-600">{props.site.name}</h1>
            </section>
            <section className="border border-gray-800 py-4 px-8 shadow-lg">
              <ul className="flex flex-row flex-wrap p-2">
                <SiteField field={`id`} value={props.site.id} />
                <SiteField field={`accountId`} value={props.site.accountId} />
                <SiteField
                  field={`accountName`}
                  value={props.site.accountName}
                />
                <SiteField
                  field={`activeLicenses`}
                  value={props.site.activeLicenses}
                />
                <SiteField field={`creator`} value={props.site.creator} />
                <SiteField field={`creatorId`} value={props.site.creatorId} />
                <SiteField field={`expiration`} value={props.site.expiration} />
                <SiteField field={`externalId`} value={props.site.externalId} />
                <SiteHealthStatusField
                  field={`healthStatus`}
                  value={props.site.healthStatus}
                />
                <SiteIsDefaultField
                  field={`isDefault`}
                  value={props.site.isDefault}
                />
                <SiteField field={`name`} value={props.site.name} />
                <SiteField field={`siteType`} value={props.site.siteType} />
                <SiteField field={`state`} value={props.site.state} />
                <SiteField field={`suite`} value={props.site.suite} />
                <SiteField
                  field={`totalLicenses`}
                  value={props.site.totalLicenses}
                />
                <SiteField
                  field={`unlimitedExpiration`}
                  value={props.site.unlimitedExpiration}
                />
                <SiteField
                  field={`unlimitedLicenses`}
                  value={props.site.unlimitedLicenses}
                />
                <SiteField
                  field={`createdAt`}
                  value={moment(props.site.createdAt)
                    .locale("ja")
                    .format("LLL")}
                />
                <SiteField
                  field={`updatedAt`}
                  value={moment(props.site.updatedAt)
                    .locale("ja")
                    .format("LLL")}
                />
              </ul>
            </section>
          </section>
        </Layout>
      ) : (
        <Loader />
      )}
    </>
  );
};

SiteDetail.getInitialProps = async function (context) {
  const { authenticated, authToken } = authenticate(context);
  const { id } = context.query;

  let site = [];

  if (authToken) {
    const {
      data: {
        data: { sites },
      },
    } = await axios.get(`${process.env.S1_CENTRAL_ENDPOINT}/sites/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    site = sites.length !== 0 ? sites[0] : null;
  }

  return {
    site,
    authenticated,
    authToken,
  };
};

export default SiteDetail;

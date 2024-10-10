import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  site: any;
  authToken: string;
}

const Site: React.FC<Props> = ({ site, authToken }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [hasSlack, setHasSlack] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [slackIntegrating, setSlackIntegrating] = useState<boolean>(false);
  const [slackIDInput, setSlackIDInput] = useState<string>("");
  const [adminEmails, setAdminEmails] = useState<string>("");
  const [emailUpdating, setEmailUpdating] = useState<boolean>(false);

  useEffect(() => {
    const main = async (): Promise<void> => {
      const {
        data: { data },
      } = await axios.get(
        `${process.env.S1_CENTRAL_ENDPOINT}/messages/site_id/${site.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const {
        data: { data: adminEmails },
      } = await axios.get(
        `${process.env.S1_CENTRAL_ENDPOINT}/administrators/site_id/${site.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const {
        data: { data: hasSlackIntegrated },
      } = await axios.get(
        `${process.env.S1_CENTRAL_ENDPOINT}/chat-agents/site_id/${site.id}/provider/SLACK`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setHasSlack(hasSlackIntegrated ? true : false);
      setAdminEmails(adminEmails ? adminEmails.email : "");
      setMessage(data ? data.message : "");
      setLoading(false);
    };

    main();
  }, []);

  const testSlackNotification = async () => {
    const PROVIDER_NANE = "SLACK";

    try {
      const {
        data: { data },
      } = await axios.get(
        `${process.env.S1_CENTRAL_ENDPOINT}/chat-agents/site_id/${site.id}/provider/${PROVIDER_NANE}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (data?.providerEndpoint) {
        await axios.post(`${process.env.SLACK_API_ENDPOINT}/sendThreat`, {
          threatName: "ダミーちゃん",
          threatLevel: 7,
          pcName: "ダミーちゃんのPC",
          directory: "ダミーちゃんのファイルパス",
          virusTotalLink:
            "https://www.virustotal.com/latest-scan/3395856ce81f2b7382dee72602f798b642f14140",
          status: "mitigated",
          conversationId: data.providerEndpoint,
          adminURL:
            "https://apne1-1001.sentinelone.net/incidents/threats/1093047526137786210/overview",
          engines: ["pre_execution"],
          siteName: "ダミーちゃんのサイト",
          initiatedBy: "agentPolicy",
          classification: "Malware",
          score: "64/67",
          fileHash: "3395856ce81f2b7382dee72602f798b642f14140",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeSlackIntegration = async () => {
    setSlackIntegrating(true);
    const PROVIDER_NANE = "SLACK";

    try {
      const {
        data: { data },
      } = await axios.get(
        `${process.env.S1_CENTRAL_ENDPOINT}/chat-agents/site_id/${site.id}/provider/${PROVIDER_NANE}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const _ = await axios.delete(
        `${process.env.S1_CENTRAL_ENDPOINT}/chat-agents/${data._id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }

    setSlackIntegrating(false);
    setHasSlack(false);
  };

  const integrateSlack = async () => {
    setSlackIntegrating(true);
    const PROVIDER_NANE = "SLACK";

    try {
      const {
        data: { channelId },
      } = await axios.post(`${process.env.SLACK_API_ENDPOINT}/conversations`, {
        name: site.name.toLowerCase().split(" ").join("-"),
        is_private: false,
        inviting_users: process.env.INITIAL_ADMINS,
      });

      if (channelId) {
        const {
          data: { data },
        } = await axios.post(
          `${process.env.S1_CENTRAL_ENDPOINT}/chat-agents`,
          {
            siteId: site.id,
            providerName: PROVIDER_NANE,
            providerEndpoint: channelId,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      } else {
        alert("既にSlackルームがあります");
      }
    } catch (err) {
      console.log(err);
    }

    setSlackIntegrating(false);
    setHasSlack(true);
  };

  const integrateExistingSlack = async () => {
    setSlackIntegrating(true);
    const PROVIDER_NANE = "SLACK";

    try {
      const {
        data: { data },
      } = await axios.post(
        `${process.env.S1_CENTRAL_ENDPOINT}/chat-agents`,
        {
          siteId: site.id,
          providerName: PROVIDER_NANE,
          providerEndpoint: slackIDInput,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }

    setSlackIntegrating(false);
    setHasSlack(true);
  };

  const createOrUpdateMessage = async () => {
    setUpdating(true);
    const {
      data: { data },
    } = await axios.get(
      `${process.env.S1_CENTRAL_ENDPOINT}/messages/site_id/${site.id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const res = data;

    if (res) {
      const {
        data: { data },
      } = await axios.put(
        `${process.env.S1_CENTRAL_ENDPOINT}/messages/${res._id}`,
        {
          siteId: site.id,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } else {
      const {
        data: { data },
      } = await axios.post(
        `${process.env.S1_CENTRAL_ENDPOINT}/messages`,
        {
          siteId: site.id,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    }
    setUpdating(false);
  };

  const onChangeSlackID = (ev: any) => {
    setSlackIDInput(ev.target.value);
  };

  const onAdminEmailsChanged = (ev: any) => {
    setAdminEmails(ev.target.value);
  };

  const createOrUpdateAdminEmails = async () => {
    setEmailUpdating(true);

    try {
      const {
        data: { data: admin },
      } = await axios.get(
        `${process.env.S1_CENTRAL_ENDPOINT}/administrators/site_id/${site.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log(admin);

      if (admin) {
        const {
          data: { data },
        } = await axios.put(
          `${process.env.S1_CENTRAL_ENDPOINT}/administrators/${admin._id}`,
          {
            siteId: site.id,
            email: adminEmails,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      } else {
        const {
          data: { data },
        } = await axios.post(
          `${process.env.S1_CENTRAL_ENDPOINT}/administrators`,
          {
            siteId: site.id,
            email: adminEmails,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      }

      setEmailUpdating(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <li className="bg-gray-900 text-gray-600 border border-gray-800 mb-2 p-4 px-8 shadow-lg flex flex-col lg:flex-row">
      <section className="flex flex-col w-full lg:w-3/12 mb-4 lg:mb-0">
        <small className="text-xs mb-2">サイト名</small>
        <Link href="/sites/[id]" as={`/sites/${site.id}`}>
          <a className="hover:underline">{site.name}</a>
        </Link>
        {slackIntegrating ? (
          <div
            className={`${
              hasSlack ? "bg-pink-700" : "bg-green-700"
            } text-center mt-4 mr-4 py-2 text-green-200`}
          >
            {hasSlack ? "Slackと解除中" : "Slackと連携中"}
          </div>
        ) : (
          <>
            {hasSlack ? (
              <>
                <div className="bg-gray-800 text-center mt-4 mr-4 py-2 text-gray-500">
                  Slack連携済み
                </div>
                <button
                  className="bg-green-900 text-center mr-4 py-2 text-white"
                  onClick={testSlackNotification}
                >
                  Slackチャネルに通知テストを送る
                </button>
                <button
                  className="bg-pink-900 text-center mr-4 py-2 text-white mb-4"
                  onClick={removeSlackIntegration}
                >
                  Slack連携を解除
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-indigo-900 text-center mt-4 mr-4 py-2 text-white mb-4"
                  onClick={integrateSlack}
                >
                  Slackと連携
                </button>
                <hr className="mr-4" />
                <input
                  className="mr-4 py-2 px-4 mt-4"
                  value={slackIDInput}
                  onChange={onChangeSlackID}
                  placeholder={`Slack IDをここに入力`}
                />
                <button
                  className="bg-indigo-900 text-center mr-4 py-2 text-white mb-4"
                  onClick={integrateExistingSlack}
                >
                  既存のSlackIDで連携
                </button>
              </>
            )}
          </>
        )}
        <small className="text-xs mb-2">通知先メールアドレス</small>
        <input
          className="mr-4 py-2 px-4 mt-4"
          value={adminEmails}
          onChange={onAdminEmailsChanged}
          placeholder={`管理者メールアドレスをここに入力`}
        />
        {emailUpdating ? (
          <div>更新中</div>
        ) : (
          <button
            className="bg-indigo-900 text-center mr-4 py-2 text-white mb-4"
            onClick={createOrUpdateAdminEmails}
          >
            管理メルアドを追加・更新
          </button>
        )}
      </section>
      {loading ? (
        <span className="w-full flex items-center">Loading...</span>
      ) : (
        <>
          <section className="w-full lg:w-7/12 flex flex-col justify-center items-center mb-4 lg:mb-0">
            <textarea
              className="w-full bg-gray-800 py-2 h-24 px-4 rounded text-sm leading-loose"
              name="message"
              value={message}
              onChange={(ev) => setMessage(ev.target.value)}
            ></textarea>
          </section>
          <section className="w-full lg:w-2/12 flex justify-center items-center">
            <button
              onClick={createOrUpdateMessage}
              className="border border-gray-800 rounded py-2 px-4 text-sm"
            >
              {updating ? <>更新中</> : <>メッセージ変更</>}
            </button>
          </section>
        </>
      )}
    </li>
  );
};

export default Site;

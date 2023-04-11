import Link from "next/link";
import { useRouter } from "next/router";

function Page({ content }) {
  const router = useRouter();

  console.log(content);

  return (
    <div className="container">
      <h2>{content.data.attributes.title}</h2>
      <div className="body">{content.data.attributes.body}</div>

      <br />
      <br />

      <Link
        href={router.asPath}
        locale={router.locale === "fr" ? "en" : "fr"}
      >
        <a>
          {router.locale === "fr" ? "montrer la traduction en français" : "Show english translation"}
        </a>
      </Link>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { id } = context.params;
  const { locale } = context;

  let translation = undefined;

  const initialRes = await fetch(`http://localhost:1337/api/salutations/${id}?populate=*`);
  const initial = await initialRes.json();
  console.log(initial.data.attributes.localizations.data)

  if (locale === "en") {
    const translationRes = await fetch(
      `http://localhost:1337/api/salutations/${initial.data.attributes.localizations.data[0].id}`
    );
    translation = await translationRes.json();
  }
  return {
    props: {
      content: translation ? translation : initial,
    },
  };
};

export default Page;
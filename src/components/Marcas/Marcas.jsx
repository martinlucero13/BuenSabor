import MarcaVino from "./MarcaVino";

export default function Marcas({ marcas }) {
  return (
    <>
      <div>
        {marcas.map((marca) => (
          <MarcaVino key={marca.id} marca={marca} />
        ))}
      </div>

      <style jsx>{`
        div {
          display: grid;
          grid-template-columns: repeat(6, 200px);
          padding: 10px;
          margin: 50px;
          align-items: center;
          justify-content: center;
        }

        .chef {
          display: flex;
          margin: 0px !important;
        }

        @media screen and (max-width: 1270px) {
          div {
            display: grid;
            grid-template-columns: repeat(4, 200px);
            padding: 20px;
            margin: 50px;
            align-items: center;
            justify-content: center;
          }
        }

        @media screen and (max-width: 850px) {
          div {
            display: grid;
            grid-template-columns: repeat(3, 200px);
            padding: 20px;
            margin: 50px;
            align-items: center;
            justify-content: center;
          }
        }

        @media screen and (max-width: 360px) {
          div {
            display: grid;
            grid-template-columns: repeat(2, 170px);
            padding: 20px;
            margin: 30px;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}

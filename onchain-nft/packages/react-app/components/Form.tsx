import styled from "@emotion/styled";

const FormContainer = styled.form`
  display: flex;
  align-items: center;
  margin: auto;
  width: fit-content;
  margin-top: 3em;
`;

const FormDiv = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 1em;
  gap: 0.5em;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;

  input {
    height: 45px;
    width: 425px;
    font-size: 1.5em;
    border: none;
    outline: none;

    &::placeholder {
      color: #d0d8df;
    }
  }
`;

const Button = styled.button`
  outline: none;
  border: none;
  background-color: #35d075;
  color: #ffffff;
  font-size: 1.25em;
  padding: 1em 2em;
  height: 3.85em;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: #c7d3e3;
    color: #ffffff;
    cursor: not-allowed;
  }
`;

export default function Form({
  name,
  setName,
  formSubmitHandler,
}: {
  name: string;
  setName: (name: string) => void;
  formSubmitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div>
      <FormContainer onSubmit={formSubmitHandler}>
        <FormDiv>
          <label htmlFor="search">
            <svg
              fill="none"
              stroke="#DAE5EF"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              width={30}
              height={30}
              style={{ marginTop: "0.5em" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </label>
          <input
            placeholder="Search Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div
            style={{
              color: "#FBCC5C",
              fontSize: "1.5em",
            }}
          >
            .celo
          </div>
        </FormDiv>
        <Button type="submit" disabled={!name || name.length < 3}>
          Search
        </Button>
      </FormContainer>
    </div>
  );
}

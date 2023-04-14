import styled from "@emotion/styled";

const InputContainer = styled.div<{ mtOff?: boolean; error?: boolean }>`
  margin: 1.5em 0;
  margin-top: ${(props) => (props.mtOff ? "0" : "1.5em")};

  input,
  textarea,
  select {
    display: block;
    width: 100%;
    outline: none;
    border: 1px solid ${(props) => (props.error ? "#ff0000" : "#1e1e1e")};
    background: transparent;
    color: #000000;
    border-radius: 5px;
    height: 45px;
    padding: 0 10px;
    margin-top: 10px;
    font-size: 1em;

    &:disabled {
      background: #1e1e1e;
      color: #000000;
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }

  textarea {
    height: auto;
    padding: 10px;
  }

  span {
    color: #ff0000;
    display: block;
    margin-top: 5px;
    font-size: 0.8em;
  }
`;

export const Input: React.FunctionComponent<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & {
    mtOff?: boolean;
    label: string;
    error?: string;
  }
> = ({
  label,
  mtOff,
  error,
  ...rest
}: {
  mtOff?: boolean;
  error?: string;
  label: string;
}) => {
  return (
    <InputContainer mtOff={mtOff} error={Boolean(error)}>
      <label style={{ color: "#000" }}>{label}</label>
      <input autoComplete="off" {...rest} />
      {error ? <span>{error}</span> : null}
    </InputContainer>
  );
};

export const InputTextArea: React.FunctionComponent<
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > & {
    mtOff?: boolean;
    label: string;
  }
> = ({ label, mtOff, ...rest }: { label: string; mtOff?: boolean }) => {
  return (
    <InputContainer mtOff={mtOff}>
      <label htmlFor={label}>{label}</label>
      <textarea id={label} rows={10} {...rest}></textarea>
    </InputContainer>
  );
};

export const InputSelect: React.FunctionComponent<
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > & {
    mtOff?: boolean;
    label: string;
    entries?: string[];
  }
> = ({
  label,
  entries,
  mtOff,
  ...rest
}: {
  mtOff?: boolean;
  label: string;
  entries?: string[];
}) => {
  return (
    <InputContainer mtOff={mtOff}>
      <label style={{ color: "#000" }} htmlFor={label}>
        {label}
      </label>
      <select {...rest}>
        <option hidden value={""}>
          Choose {label}
        </option>
        {entries?.map((entry, index) => (
          <option key={index}>{entry}</option>
        ))}
      </select>
    </InputContainer>
  );
};

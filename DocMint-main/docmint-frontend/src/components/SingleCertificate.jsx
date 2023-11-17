import { useContext, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Web3Context } from "../context/Web3Context";
import { upload } from "../utils/crypt";
import Modal from "./CreateModal";

const con = {
	required: { value: true, message: "This field is Required" },
	minLength: { value: 3, message: "At least 3 characters required" },
};

const SingleCertificate = () => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		getValues,
	} = useForm();

	const { contract, accountAddress } = useContext(Web3Context);

	const [modalData, setModalData] = useState({ mode: "closed" });

	const onSubmit = async (data) => {
		if (accountAddress) {
			setModalData({ mode: "loading" });
			const { ipfsHash, certkey } = await upload(data);

			const expDate = getValues("ExpirationDate")
				? Math.floor(new Date(getValues("ExpirationDate")).getTime() / 1000)
				: 0;

			await contract.methods
				.generateCert(ipfsHash.toString(), expDate, ipfsHash.toString())
				.send({ from: accountAddress })

				.on("transactionHash", function (hash) {
					console.log(hash);
				})

				.on("receipt", function (receipt) {
					setModalData({
						mode: "display",
						data: { ipfsHash, certkey },
						receipt: receipt,
					});
				})

				.on("error", function (error) {
					console.log(error);
					window.alert(error.message);
					setModalData("closed");
				});
		} else {
			window.alert("Please Connect an Wallet First");
		}
	};

	return (
		<div className="single">
			<Modal modalData={modalData} setModalData={setModalData} />
			<div className="txt">
				<h2>Issue Certificates</h2>
				<div className="inner">
					<span>
						Issue certificates with the form. Fill
						out the form and create a new certificate.
					</span>
					<span>
						Pay minimal transaction fee and get a copy of the certificate Hash and Key.
					</span>
				</div>
				<hr />
				<Code control={control} />
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					name="BeneficiaryName"
					label="Person Name"
					type="text"
					conditions={con}
					register={register}
					errors={errors}
				/>
				<Input
					name="CertificateDescription"
					label="Certificate Description"
					type="text"
					conditions={con}
					register={register}
					errors={errors}
				/>
				<Input
					name="ExpirationDate"
					label="Expiry Date"
					type="date"
					register={register}
					errors={errors}
				/>
				<Input
					name="InstituteAuthorityName"
					label="Organization Name"
					type="text"
					conditions={con}
					register={register}
					errors={errors}
				/>
				<input type="submit" value="Issue Certificate" />
			</form>
		</div>
	);
};

const Code = ({ control }) => {
	const watchedAllFields = useWatch({ control });
	return (
		<div className="code">
			<span>Certificate JSON</span>
			<pre>{JSON.stringify(watchedAllFields, null, 2)}</pre>
		</div>
	);
};

const Input = ({ name, label, type, register, conditions, errors, value }) => (
	<div className="item">
		<label>{label}</label>{" "}
		<span className="error">
			{errors[name] && <span>{errors[name]?.message}</span>}
		</span>
		<input
			{...register(name, conditions)}
			type={type}
			name={name}
			value={value}
		/>
	</div>
);

export default SingleCertificate;

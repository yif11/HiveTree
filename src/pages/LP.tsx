import treeImage from "./tree-image.png";

const LP = () => {
	return (
		<div className="font-sans h-screen overflow-y-scroll snap-y snap-mandatory">
			{/* タイトルページ */}
			{/* <section className="snap-start h-screen flex justify-between p-8 bg-[#f2f9f2]"> */}
			<section className="snap-start h-screen flex max-md:flex-col md:flex-row items-center justify-between p-8 bg-[#f2f9f2]">
				<img
					src={treeImage}
					alt="Tree Graphic"
					// className="max-w-[40%] items-start"
					className="w-full md:max-w-[40%] max-h-full object-contain max-md:mb-0"
				/>
				<div className="items-center flex flex-col justify-center text-center md:mt-8 max-md:gap-0 md:gap-6">
					<p className="text-xl md:text-3xl font-bold">
						あなたのひとりごとが、社会の声になる。
					</p>
					<h1 className="text-6xl md:text-8xl font-bold">HiveTree</h1>
					<button
						type="button"
						onClick={() => {
							window.location.href = "http://localhost:5173/topic-list/";
						}}
						className="bg-[#A9C8A9] text-white border-none rounded-full px-8 py-4 text-lg mt-2 md:mt-6 cursor-pointer"
					>
						START NOW
					</button>
				</div>
			</section>

			{/* キャッチフレーズ */}
			<section className="snap-start h-screen flex flex-col justify-center items-center p-8 bg-[#f2f9f2] text-center">
				<h2 className="text-2xl md:text-4xl font-bold">
					言いたいけど言えない。
					<br className="md:hidden" />
					つぶやきたいけど届かない。
				</h2>
				<p className="mt-4 text-xl md:text-3xl max-w-[600px]">
					HiveTreeは、
					<br className="md:hidden" />
					そんな“もどかしさ”を解消する
					<br />
					新しいSNSです。
				</p>
			</section>

			{/* 2つの機能 */}
			<section className="snap-start h-screen overflow-y-auto p-8 bg-[#f2f9f2]">
				<h2 className="text-2xl md:text-4xl font-bold text-center">
					HiveTreeの2つの機能
				</h2>

				<div className="bg-[#d7eaf7] p-6 rounded-xl mt-8 shadow-md md:max-w-[60%] items-center mx-auto">
					<h3 className="font-bold text-lg md:text-2xl">
						個人ではなく、集団との対話。
					</h3>
					<p className="text-lg md:text-xl">
						あなたの投稿は、ユーザー一人ひとりに届くのではなく、集団の声に溶け込みます。
						そして、あなたに届けられるのは、集団の声。
						つぶやくのは誰にも見えないひとりごとだけど、まわりの反応は見える不思議な体験。
					</p>
				</div>

				<div className="bg-[#e7f5e6] p-6 rounded-xl mt-8 shadow-md md:max-w-[60%] items-center mx-auto">
					<h3 className="font-bold text-lg md:text-2xl">
						対話を通して、声を育てる。
					</h3>
					<p className="text-lg md:text-xl">
						集団との対話を重ねることで、集団の声は育っていきます。
						さまざまな思い、意見、共感が生まれ、深化し、新たなトピックへと進化。
						ただの壁打ちでじゃない、新しい交流の形です。
					</p>
				</div>
			</section>
		</div>
	);
};

export default LP;

// import React from "react";
// import treeImage from "./tree-image.png";

// const LP = () => {
// 	return (
// 		<div
// 			style={{
// 				fontFamily: "sans-serif",
// 				backgroundColor: "#f7f7f7",
// 				padding: "2rem",
// 			}}
// 		>
// 			{/* タイトルページ */}
// 			<section
// 				style={{
// 					display: "flex",
// 					alignItems: "center",
// 					justifyContent: "space-between",
// 				}}
// 			>
// 				<img
// 					src={treeImage}
// 					alt="Tree Graphic"
// 					style={{ maxWidth: "40%" }}
// 				/>
// 				<div>
// 					<p style={{ fontSize: "1rem", fontWeight: "bold" }}>
// 						あなたのひとりごとが、社会の声になる。
// 					</p>
// 					<h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>APP NAME</h1>
// 					<button
// 						style={{
// 							backgroundColor: "#4a84c0",
// 							color: "white",
// 							border: "none",
// 							borderRadius: "30px",
// 							padding: "1rem 2rem",
// 							fontSize: "1.2rem",
// 							marginTop: "1rem",
// 							cursor: "pointer",
// 						}}
// 					>
// 						START NOW
// 					</button>
// 				</div>
// 			</section>

// 			{/* 課題セクション */}
// 			<section style={{ marginTop: "4rem", textAlign: "center" }}>
// 				<h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>
// 					言いたいけど言えない。つぶやきたいけど届かない。
// 				</h2>
// 				<p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
// 					APP NAMEは、そんな“もどかしさ”を解消する新しいSNSです。
// 				</p>
// 			</section>

// 			{/* 機能セクション */}
// 			<section style={{ marginTop: "4rem" }}>
// 				<h2>APP NAMEの2つの機能</h2>

// 				<div
// 					style={{
// 						backgroundColor: "#d7eaf7",
// 						padding: "1.5rem",
// 						borderRadius: "10px",
// 						marginTop: "1rem",
// 					}}
// 				>
// 					<h3 style={{ fontWeight: "bold" }}>個人ではなく、集団との対話。</h3>
// 					<p>
// 						あなたの投稿は、ユーザー一人ひとりに届くのではなく、集団の声に溶け込みます。
// 						そして、あなたに届けられるのは、集団の声。
// 						つぶやくのは誰にも見えないひとりごとだけど、まわりの反応は見える不思議な体験。
// 					</p>
// 				</div>

// 				<div
// 					style={{
// 						backgroundColor: "#e7f5e6",
// 						padding: "1.5rem",
// 						borderRadius: "10px",
// 						marginTop: "1.5rem",
// 					}}
// 				>
// 					<h3 style={{ fontWeight: "bold" }}>対話を通して、声を育てる。</h3>
// 					<p>
// 						集団との対話を重ねることで、集団の声は育っていきます。
// 						さまざまな思い、意見、共感が生まれ、深化し、新たなトピックへと進化。
// 						ただの壁打ちでじゃない、新しい交流の形です。
// 					</p>
// 				</div>
// 			</section>
// 		</div>
// 	);
// };

// export default LP;

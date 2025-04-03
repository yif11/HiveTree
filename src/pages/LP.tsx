import React from "react";
import treeImage from "./tree-image.png";

const LP = () => {
	return (
		<div
			style={{
				fontFamily: "sans-serif",
				height: "100vh",
				overflowY: "scroll",
				scrollSnapType: "y mandatory",
			}}
		>
			{/* タイトルページ */}
			<section
				style={{
					scrollSnapAlign: "start",
					height: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "2rem",
					backgroundColor: "#f2f9f2",
				}}
			>
				<img src={treeImage} alt="Tree Graphic" style={{ maxWidth: "40%" }} />
				<div>
					<p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
						あなたのひとりごとが、社会の声になる。
					</p>
					<h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>HiveTree</h1>
					<button
						style={{
							backgroundColor: "#4a84c0",
							color: "white",
							border: "none",
							borderRadius: "30px",
							padding: "1rem 2rem",
							fontSize: "1.2rem",
							marginTop: "1.5rem",
							cursor: "pointer",
						}}
					>
						START NOW
					</button>
				</div>
			</section>

			{/* キャッチフレーズ */}
			<section
				style={{
					scrollSnapAlign: "start",
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					padding: "2rem",
					backgroundColor: "#f2f9f2",
					textAlign: "center",
				}}
			>
				<h2 style={{ fontSize: "2.2rem", fontWeight: "bold" }}>
					言いたいけど言えない。つぶやきたいけど届かない。
				</h2>
				<p style={{ marginTop: "1rem", fontSize: "1.2rem", maxWidth: "600px" }}>
					HiveTreeは、そんな“もどかしさ”を解消する新しいSNSです。
				</p>
			</section>

			{/*2つの機能 */}
			<section
				style={{
					scrollSnapAlign: "start",
					height: "100vh",
					overflowY: "auto",
					padding: "2rem",
					backgroundColor: "#f2f9f2",
				}}
			>
				<h2
					style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}
				>
					HiveTreeの2つの機能
				</h2>

				<div
					style={{
						backgroundColor: "#d7eaf7",
						padding: "1.5rem",
						borderRadius: "10px",
						marginTop: "2rem",
					}}
				>
					<h3 style={{ fontWeight: "bold" }}>個人ではなく、集団との対話。</h3>
					<p>
						あなたの投稿は、ユーザー一人ひとりに届くのではなく、集団の声に溶け込みます。
						そして、あなたに届けられるのは、集団の声。
						つぶやくのは誰にも見えないひとりごとだけど、まわりの反応は見える不思議な体験。
					</p>
				</div>

				<div
					style={{
						backgroundColor: "#e7f5e6",
						padding: "1.5rem",
						borderRadius: "10px",
						marginTop: "1.5rem",
					}}
				>
					<h3 style={{ fontWeight: "bold" }}>対話を通して、声を育てる。</h3>
					<p>
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

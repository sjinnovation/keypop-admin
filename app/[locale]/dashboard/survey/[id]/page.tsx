"use client";
import { useEffect, useState } from "react";
import { getSurveyById } from "@/Api/SurveyApi";
import AddSurvey from "@/components/SurveyManagement/AddSurvey";
import { SurveyData } from "@/types/surveyTypes";
import { useParams } from "next/navigation";


export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  const [surveyData, setSurveyData] = useState<SurveyData>({
    title: "",
    country: "",
    categories: [],
    questions: [],
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const data = await getSurveyById(id);
      setSurveyData(data);
    } catch (err) {
      console.error("Error fetching survey:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="container">
        <div className="flex justify-center items-center h-64">
          <div>Loading survey data...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container bg-red-300">
      <AddSurvey initialData={surveyData} />
    </main>
  );
}
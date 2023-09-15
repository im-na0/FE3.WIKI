import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

export class ProjectInfo {
  constructor(
    public id: string,
    public title: string,
    public status: "progress" | "completed" | "plus",
    public order: number,
    public assignees: string[],
    public duration: string[],
  ) {}
  toString() {
    return this.id + ", " + this.title + ", " + this.status + ", " + this.order;
  }
}
export class ProjectDetail {
  constructor(
    public title: string,
    public status: "progress" | "completed" | "plus",
    public order: number,
    public assignees: string[],
    public duration: string[],
    public teams: string[],
    public data: string,
    public id?: string,
  ) {}
  toString() {
    return this.id + ", " + this.title + ", " + this.status + ", " + this.order;
  }
}

export const projectConverter: FirestoreDataConverter<ProjectInfo> = {
  toFirestore: (docData: ProjectInfo): DocumentData => {
    return {
      title: docData.title,
      status: docData.status,
      order: docData.order,
      assignees: docData.assignees,
      duration: docData.duration,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ) => {
    const sn = snapshot;
    const data = snapshot.data(options);
    return new ProjectInfo(
      sn.id,
      data.title,
      data.status,
      data.order,
      data.assignees,
      data.duration,
    );
  },
};

export const projectDetailConverter: FirestoreDataConverter<ProjectDetail> = {
  toFirestore: (docData: ProjectDetail): DocumentData => {
    return {
      title: docData.title,
      status: docData.status,
      order: docData.order,
      assignees: docData.assignees,
      duration: docData.duration,
      teams: docData.teams,
      data: docData.data,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ) => {
    const sn = snapshot;
    const data = snapshot.data(options);
    return new ProjectDetail(
      data.title,
      data.status,
      data.order,
      data.assignees,
      data.duration,
      data.teams,
      data.data,
      sn.id,
    );
  },
};
